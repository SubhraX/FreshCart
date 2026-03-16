import { GoogleGenerativeAI } from "@google/generative-ai";
import { spawn } from "child_process";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialize using the modern class name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // 2️⃣ Gemini 2.5 Nutrition Extraction
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Analyze these food items:
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
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");
    
    const nutrition = JSON.parse(jsonMatch[0]);

    // 3️⃣ Prepare Feature Vector for Python
    const features = [
      Number(nutrition.protein) || 0,
      Number(nutrition.carbs) || 0,
      Number(nutrition.fat) || 0,
      Number(nutrition.sugar) || 0,
      Number(nutrition.fiber) || 0,
      Number(nutrition.processed_count) || 0
    ];

    // 4️⃣ Call Python ML Model (Windows compatible)
    const scriptPath = path.resolve("ai/predict.py");
    // Use "python" or "py" depending on your environment
    const python = spawn("python", [
      scriptPath,
      JSON.stringify(features)
    ]);

    let dataString = "";

    python.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python Error: ${data.toString()}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ message: "Health Model prediction failed" });
      }

      const score = parseFloat(dataString.trim());

      res.json({
        healthScore: isNaN(score) ? 0 : score,
        cartSummary: {
          calories: nutrition.calories || 0,
          protein: nutrition.protein || 0,
          carbs: nutrition.carbs || 0,
          fat: nutrition.fat || 0,
          sugar: nutrition.sugar || 0,
          fiber: nutrition.fiber || 0
        }
      });
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: "Analysis failed" });
  }
};