import express from "express";
import { analyzeCart } from "../controllers/aiscore.controller.js";

const router = express.Router();

router.post("/analyze", analyzeCart);

export default router;