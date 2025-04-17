import mongoose from 'mongoose';

const personalChatSchema = new mongoose.Schema({
  participants: [String],
  messages: [
    {
      sender: String,
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("PersonalChat", personalChatSchema);