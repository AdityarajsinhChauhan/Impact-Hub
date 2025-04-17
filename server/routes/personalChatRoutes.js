import express from 'express';
import PersonalChat from '../models/PersonalChat.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { email1, email2 } = req.body;

  let chat = await PersonalChat.findOne({ participants: { $all: [email1, email2] } });

  if (!chat) {
    chat = new PersonalChat({ participants: [email1, email2], messages: [] });
    await chat.save();
  }

  res.json(chat);
});

router.get('/:email', async (req, res) => {
  const email = req.params.email;
  const chats = await PersonalChat.find({ participants: email });
  res.json(chats);
});

router.get('/chat/:id', async (req, res) => {
  const chat = await PersonalChat.findById(req.params.id);
  res.json(chat);
  console.log(chat);
});

export default router;
