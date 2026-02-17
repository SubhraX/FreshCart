import express from "express";
import Item from "../models/item.model.js";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/recipe", async (req, res) => {
  try {
    const { dish } = req.body;
    if (!dish) return res.status(400).json({ message: "Dish name required" });

    // 1. AI GENERATION
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a JSON array of raw ingredients for "${dish}". Keep names simple (e.g., "chicken", "chilli", "oil").`
    });

    const ingredientList = JSON.parse(response.text.match(/\[.*\]/s)[0]);

    // 2. FETCH DATABASE
    const cookingCategories = [
      "Bakery, Cakes & Dairy",
      "Foodgrains, Oil & Masala",
      "Fruits & Vegetables",
      "Eggs, Meat & Fish"
    ];
    const products = await Item.find({ category: { $in: cookingCategories } });

    // 3. UPDATED BULLETPROOF MATCHING LOGIC
    const result = ingredientList.map((ingredient) => {
      const rawInput = ingredient.toLowerCase().trim();
      
      const normalize = (str) => str.replace(/ies$|s$|i$|y$/g, '');
      
      const searchTerms = rawInput
        .split(/[\s-]+/)
        .map(term => normalize(term))
        .filter(term => term.length > 2);

      const matchedProducts = products
        .map(product => {
          const name = product.productName.toLowerCase();
          const normalizedName = normalize(name);
          const category = product.category;
          let score = 0;

          // --- FIX 1: THE DEALBREAKER (Anti-Eggless/Sugar-free) ---
          const negatives = ["less", "free", "substitute", "alternative"];
          if (negatives.some(n => name.includes(rawInput + n) || name.includes(rawInput + "-" + n))) {
            return null; 
          }

          // A. Term Matching
          const matches = searchTerms.filter(term => normalizedName.includes(term));
          if (matches.length === 0) return null;
          score += (matches.length * 20);

          // --- FIX 2: CATEGORY ANCHORING (Massive Priority) ---
          if (["egg", "chicken", "meat", "fish"].some(word => rawInput.includes(word))) {
            if (category === "Eggs, Meat & Fish") score += 150; 
          }
          if (["oil", "masala", "dal", "rice", "atta"].some(word => rawInput.includes(word))) {
            if (category === "Foodgrains, Oil & Masala") score += 100;
          }

          // C. Sequence Bonus
          if (name.includes(rawInput)) score += 50;

          // D. Exact Word & Start Bonus
          if (new RegExp(`\\b${rawInput}\\b`, 'i').test(name)) score += 60;
          if (name.startsWith(searchTerms[0])) score += 15;

          // E. Exclusion Penalty (Stronger)
          const exclusions = ["masala", "powder", "mix", "paste", "ready", "instant"];
          const hasExclusion = exclusions.some(ex => name.includes(ex));
          
          if (hasExclusion && !rawInput.includes("masala") && !rawInput.includes("powder")) {
            score -= 80; // Heavier penalty to keep masalas away from raw meat
          }

          return { product, score };
        })
        .filter(item => item !== null && item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(item => item.product);

      return {
        name: ingredient,
        matchedProducts
      };
    });

    res.json({ ingredients: result });
  } catch (error) {
    console.error("Critical AI Error:", error);
    res.status(500).json({ message: "Recipe generation failed" });
  }
});

export default router;