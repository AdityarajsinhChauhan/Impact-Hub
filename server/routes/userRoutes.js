import express from "express";
import Opportunity from "../models/Opportunity.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Get all opportunities
router.get("/", protect, async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
});

router.get("/:email", protect, async (req, res) => {
  try {
    const userDetails = await User.findOne({ email: req.params.email });
    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});



export default router;
