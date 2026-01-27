import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./src/lib/db.js";
import itemRoutes from './src/routes/item.route.js';
import authRoutes from './src/routes/auth.route.js'; // NEW IMPORT for authentication routes

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,
}));

app.use(express.json());

// Existing route for items
app.use('/items', itemRoutes);

// NEW: Mount authentication routes at '/api/auth'
// This matches the LOGIN_ENDPOINT and SIGNUP_ENDPOINT paths used in the frontend.
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    ConnectDB();
});