import mongoose from "mongoose";

const contentItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String},
    description: { type: String },
    link: String,
    contentTime: Date,
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

export default mongoose.model("ContentItem", contentItemSchema);



