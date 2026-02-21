import express from "express";
import { getDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET completed destinations as journals
router.get("/", async (req, res) => {
  try {
    const db = await getDB();
    const journals = await db
      .collection("journals")
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
    const db = await getDB();
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
      .collection("journals")
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
    const db = await getDB();

    // Total planned
    const plannedCount = await db
      .collection("journals")
      .countDocuments({ status: { $ne: "completed" } });

    // Total completed
    const completedCount = await db
      .collection("journals")
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
// POST to create a journal entry manually (optional but counts for CRUD)
router.post("/", async (req, res) => {
  try {
    const db = await getDB();
    const { name, rating, reviewText } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }

    const doc = {
      name: name.trim(),
      rating: Number.isFinite(Number(rating)) ? Math.min(5, Math.max(1, Number(rating))) : 0,
      reviewText: reviewText || "",
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
      visitedAt: new Date()
    };

    const result = await db.collection("journals").insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    console.error("POST /journals error:", err);
    res.status(500).json({ error: "Failed to create journal" });
  }
});

// DELETE a journal entry
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const result = await db.collection("journals").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "not found" });

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /journals/:id error:", err);
    res.status(500).json({ error: "Failed to delete journal" });
  }
});

export default router;
