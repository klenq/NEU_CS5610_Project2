import express from "express";
import { getDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET completed destinations as journals
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const journals = await db
      .collection("destinations")
      .find({ status: "completed" })
      .toArray();
    res.json(journals);
  } catch (err) {
    console.error("GET /journals error:", err);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
});

// POST to add review and rating to a completed destination
router.post("/:id/review", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { rating, reviewText } = req.body;

    const updateDoc = {
      $set: {
        rating: rating ? parseInt(rating) : 0,
        reviewText: reviewText || "",
        reviewedAt: new Date(),
      },
    };

    const result = await db
      .collection("destinations")
      .updateOne({ _id: new ObjectId(id), status: "completed" }, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Completed destination not found" });
    }

    res.json({ message: "Review added successfully" });
  } catch (err) {
    console.error("POST /review error:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
});

// GET stats
router.get("/stats", async (req, res) => {
  try {
    const db = getDB();

    // Total planned
    const plannedCount = await db
      .collection("destinations")
      .countDocuments({ status: { $ne: "completed" } });

    // Total completed
    const completedCount = await db
      .collection("destinations")
      .countDocuments({ status: "completed" });

    res.json({
      planned: plannedCount,
      completed: completedCount,
      total: plannedCount + completedCount,
    });
  } catch (err) {
    console.error("GET /stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
