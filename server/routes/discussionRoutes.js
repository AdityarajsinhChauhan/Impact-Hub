import express from "express";
import Discussion from "../models/Discussion.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try{
    const discussions = await Discussion.find();
  res.json(discussions);
  }
  catch(error){
    res.status(500).json({ error: "Failed to fetch discussions" });
  }
});

router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const discussion = await Discussion.findById(id);
  res.json(discussion);
});

router.post("/", protect, async (req, res) => {
  const { title, description, tags } = req.body;
  const discussion = new Discussion({ title, description, tags, createdBy: req.user._id });
  try {
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ error: "Failed to create discussion" });
  }
});



export default router;
