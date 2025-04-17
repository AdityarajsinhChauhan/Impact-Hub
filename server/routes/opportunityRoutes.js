// routes/opportunityRoutes.js
import express from "express";
import Opportunity from "../models/Opportunity.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all opportunities
router.get("/", protect, async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
});

// Add a new opportunity
router.post("/", protect, async (req, res) => {
  try {
    const newOpportunity = new Opportunity(req.body);
    await newOpportunity.save();
    res.status(201).json({ message: "Opportunity added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add opportunity" });
  }
});

export default router;
