import express from "express";
import ContentItem from "../models/ContentItem.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

import fs from 'fs';
import path from 'path';
import { fetchAllContent } from "../utils/fetchAllContent.js";

// 🛠️ Manual fetch and save route
router.post("/fetch", async (req, res) => {
  try {
    const filePath = path.resolve("timestamps.json");
    const rawData = fs.readFileSync(filePath);
    const timestamps = JSON.parse(rawData);

    const allContent = await fetchAllContent(timestamps);

    let savedCount = 0;
    const latestTimestamps = { ...timestamps };

    for (const item of allContent) {
      const contentDate = new Date(item.createdAt || item.contentTime);
      const lastTime = timestamps[item.category] ? new Date(timestamps[item.category]) : null;

      if (!lastTime || contentDate > lastTime) {
        // Save to MongoDB
        const newItem = new ContentItem({
          title: item.title,
          category: item.category,
          image: item.image,
          description: item.description,
          link: item.link,
          contentTime: contentDate
        });

        await newItem.save();
        savedCount++;

        // Update latest timestamp
        if (!latestTimestamps[item.category] || contentDate > new Date(latestTimestamps[item.category])) {
          latestTimestamps[item.category] = contentDate.toISOString();
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(latestTimestamps, null, 2));
    res.json({ message: `✅ Fetched and saved ${savedCount} new content items.` });
  } catch (err) {
    console.error("Manual fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch and save content." });
  }
});


// GET all content items (sorted by newest first)
router.get("/", protect, async (req, res) => {
  try {
    const contentItems = await ContentItem.find().sort({ createdAt: -1 });
    res.json(contentItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// POST route to add content

  

export default router;
