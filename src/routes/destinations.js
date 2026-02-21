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
    const { name, description, budget } = req.body || {};


    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const update = { $set: { updatedAt: new Date() } };
    if (typeof name === "string") update.$set.name = name.trim();
    if (typeof description === "string") update.$set.description = description.trim();
    if (budget !== undefined) update.$set.budget = Number(budget);

    const result = await db
      .collection("destinations")
      .updateOne({ _id: new ObjectId(id) }, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const updated = await db
      .collection("destinations")
      .findOne({ _id: new ObjectId(id) });

    res.json(updated);
  } catch (err) {
    console.error("PUT /destinations/:id error:", err);
    res.status(500).json({ error: "Failed to update destination" });
  }
});

// DELETE a destination
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

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

// PUT (complete) a destination -> move to journals collection
router.put("/:id/complete", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const { rating, reviewText } = req.body || {};

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const destinationsCol = db.collection("destinations");
    const journalsCol = db.collection("journals");

    const dest = await destinationsCol.findOne({ _id: new ObjectId(id) });
    if (!dest) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const journalDoc = {
      destinationId: dest._id,
      name: dest.name,
      description: dest.description || "",
      budget: dest.budget ?? 0,
      status: "completed",
      rating: Number.isFinite(Number(rating))
        ? Math.min(5, Math.max(1, Number(rating)))
        : 0,
      reviewText: (reviewText || "").toString(),
      completedAt: new Date(),
      createdAt: dest.createdAt || new Date(),
      updatedAt: new Date()
    };

    const insertResult = await journalsCol.insertOne(journalDoc);
    await destinationsCol.deleteOne({ _id: dest._id });

    res.json({
      message: "Destination moved to journals",
      journalId: insertResult.insertedId
    });
  } catch (err) {
    console.error("PUT /destinations/:id/complete error:", err);
    res.status(500).json({ error: "Failed to complete destination" });
  }
});

export default router;

