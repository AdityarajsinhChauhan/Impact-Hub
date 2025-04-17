// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
  user: String,
  text: String,
  time: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
