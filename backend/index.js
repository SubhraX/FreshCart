import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./src/lib/db.js";
import itemRoutes from './src/routes/item.route.js';
import authRoutes from './src/routes/auth.route.js';
import paymentRoutes from './src/routes/payment.js';
import aiRoutes from "./src/routes/ai.route.js";
import aiscoreRoute from "./src/routes/aiscore.route.js";

// 1. Load environment variables first
dotenv.config();

// 2. Initialize the app
const app = express();

// 3. Middlewares
app.use(cors({
    origin: ["http://localhost:3000", "https://freshcart-cfsv.onrender.com"],
    credentials: true,
}));

app.use(express.json());

// 4. Routes (All app.use calls must come after "const app = express()")
app.use('/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Correct placement for the AI Score Route
app.use("/api/aiscore", aiscoreRoute); 

// 5. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    ConnectDB();
});