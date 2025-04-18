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

// Update user interests
router.put("/update-interests", protect, async (req, res) => {
  try {
    const { interests } = req.body;
    
    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: "Interests must be an array" });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { interests },
      { new: true }
    );
    
    res.json({
      success: true,
      interests: updatedUser.interests
    });
  } catch (err) {
    console.error("Error updating interests:", err);
    res.status(500).json({ message: "Failed to update interests" });
  }
});

// Update user profile (name, bio)
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { name, bio } = req.body;
    
    // Create an object with only the fields that were provided
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    
    // If no fields to update, return error
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      updateFields,
      { new: true }
    );
    
    res.json({
      success: true,
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        email: updatedUser.email,
        interests: updatedUser.interests
      }
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
