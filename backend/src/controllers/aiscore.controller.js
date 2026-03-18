import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Using the same initialization class as your Recipe code
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeCart = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items required" });
    }

    // 1️⃣ Filter only food items
    const foodCategories = [
      "Bakery, Cakes & Dairy",
      "Beverages",
      "Eggs, Meat & Fish",
      "Foodgrains, Oil & Masala",
      "Fruits & Vegetables",
      "Snacks & Branded Foods"
    ];

    const foodItems = cartItems.filter(item =>
      foodCategories.includes(item.category)
    );

    if (foodItems.length === 0) {
      return res.json({
        healthScore: 0,
        message: "No food items in cart to analyze"
      });
    }

    // 2️⃣ Gemini Nutrition Extraction (Using gemini-3-flash-preview)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these food items:
${foodItems.map(i => `${i.brand} ${i.productName}`).join("\n")}

Return ONLY a JSON object with the TOTAL sum of these values:
{
 "calories": number,
 "protein": number,
 "carbs": number,
 "fat": number,
 "sugar": number,
 "fiber": number,
 "processed_count": number
}`
    });

    // Extract text and parse JSON (using the same logic as ChefGen)
    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");
    
    const nutrition = JSON.parse(jsonMatch[0]);

    // 3️⃣ Prepare Feature Vector for the Flask Server
    const features = [
      Number(nutrition.protein) || 0,
      Number(nutrition.carbs) || 0,
      Number(nutrition.fat) || 0,
      Number(nutrition.sugar) || 0,
      Number(nutrition.fiber) || 0,
      Number(nutrition.processed_count) || 0
    ];

    // 4️⃣ Call the Separate Flask ML Server (Replaces spawn)
    // Local: http://127.0.0.1:10000 | Production: Your Render URL
    const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://127.0.0.1:10000";
    
    const mlResponse = await axios.post(`${ML_SERVER_URL}/predict`, { 
      features: features 
    });

    // 5️⃣ Send consolidated response to Frontend
    res.json({
      healthScore: mlResponse.data.healthScore || 0,
      cartSummary: {
        calories: nutrition.calories || 0,
        protein: nutrition.protein || 0,
        carbs: nutrition.carbs || 0,
        fat: nutrition.fat || 0,
        sugar: nutrition.sugar || 0,
        fiber: nutrition.fiber || 0
      }
    });

  } catch (error) {
    // Check if it's an Axios error from the Python server
    if (error.response) {
      console.error("Python Server Error:", error.response.data);
    } else {
      console.error("AI Analysis Error:", error.message);
    }
    
    res.status(500).json({ 
      message: "Analysis failed. Ensure ML server is running.",
      error: error.message 
    });
  }
};