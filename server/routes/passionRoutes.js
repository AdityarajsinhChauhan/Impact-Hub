import express from "express";
import ContentItem from "../models/User.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', protect, async (req, res) => {
    console.log(req.user)
    const { passion } = req.body;
    const userId = req.user._id;// assuming you're using JWT and middleware to set req.user
  
    try{
        const user = await User.findByIdAndUpdate(userId, { passion });
        res.status(200).json({ message: 'Passion saved' });
    }catch(err){
        res.status(500).json({ message: 'Failed to save passion' });
    }
  });

  router.get('/', protect, async (req, res) => {
    const userId = req.user.id; // assuming you're using JWT and middleware to set req.user
  
    try{
        const user = await User.findById(userId);
        const passion = user.passion;
        res.json({ passion });
    }catch(err){
        res.status(500).json({ message: 'Failed to save passion' });
    }
  });
  
  export default router;