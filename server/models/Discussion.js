import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String], // <-- new
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;
