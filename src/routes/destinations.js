import express from "express";
import { getDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all destinations
router.get("/", async (req, res) => {
  try {
    const db = await getDB();
    const destinations = await db
      .collection("destinations")
      .find({ status: { $ne: "completed" } })
      .toArray();
    res.json(destinations);
  } catch (err) {
    console.error("GET /destinations error:", err);
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

// POST a new destination
router.post("/", async (req, res) => {
  try {
    const db = await getDB();
    const { name, description, budget } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newDestination = {
      name,
      description: description || "",
      budget: budget ? parseFloat(budget) : 0,
      status: "planned",
      createdAt: new Date(),
    };

    const result = await db
      .collection("destinations")
      .insertOne(newDestination);
    newDestination._id = result.insertedId;

    res.status(201).json(newDestination);
  } catch (err) {
    console.error("POST /destinations error:", err);
    res.status(500).json({ error: "Failed to create destination" });
  }
});

// PUT (update) a destination
router.put("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const { name, description, budget } = req.body;

    const updateDoc = {
      $set: {
        name,
        description,
        budget: budget ? parseFloat(budget) : 0,
        updatedAt: new Date(),
      },
    };

    const result = await db
      .collection("destinations")
      .updateOne({ _id: new ObjectId(id) }, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json({ message: "Destination updated successfully" });
  } catch (err) {
    console.error("PUT /destinations error:", err);
    res.status(500).json({ error: "Failed to update destination" });
  }
});

// DELETE a destination
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;

    const result = await db
      .collection("destinations")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    console.error("DELETE /destinations error:", err);
    res.status(500).json({ error: "Failed to delete destination" });
  }
});

// PUT (complete) a destination -> moves it to journals conceptually
router.put("/:id/complete", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;

    const result = await db
      .collection("destinations")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "completed", completedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json({ message: "Destination marked as completed" });
  } catch (err) {
    console.error("PUT /complete error:", err);
    res.status(500).json({ error: "Failed to complete destination" });
  }
});

export default router;
