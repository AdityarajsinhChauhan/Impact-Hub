import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";  

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, {
      location: { latitude, longitude },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find(
      { location: { $exists: true } },
      "name email location"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
