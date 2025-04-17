import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get all messages for a discussion
router.get('/:discussionId', async (req, res) => {
  const messages = await Message.find({ discussionId: req.params.discussionId }).sort({ time: 1 });
  res.json(messages);
});

// Post a message to a discussion
router.post('/:discussionId', async (req, res) => {
  const { user, text } = req.body;
  const newMsg = new Message({
    discussionId: req.params.discussionId,
    user,
    text
  });
  await newMsg.save();
  res.status(201).json(newMsg);
});

export default router;
