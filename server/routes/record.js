import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();


// Create a new record
router.post("/", async (req, res) => {
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const collection = db.collection("records");
    const result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// Update a record by ID
router.patch("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid ID format");
  }
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const collection = db.collection("records");
    const result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// Delete a record by ID
router.delete("/", async (req, res) => {
  const ids = req.body.ids;  // Assume IDs are passed as an array in the request body

  // Validate all provided IDs
  if (!ids.every(ObjectId.isValid)) {
    return res.status(400).send("Invalid ID format in array");
  }

  try {
    const query = { _id: { $in: ids.map(id => new ObjectId(id)) } };
    const collection = db.collection("records");
    const result = await collection.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("No records found to delete");
    }
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting records");
  }
});

// I have also created another function
/* 
router.delete("/bulk-delete", async (req, res) => {
  const ids = req.body.ids;  // Assume IDs are passed as an array in the request body

  // Validate all provided IDs
  if (!ids.every(ObjectId.isValid)) {
    return res.status(400).send("Invalid ID format in array");
  }

  try {
    const query = { _id: { $in: ids.map(id => new ObjectId(id)) } };
    const collection = db.collection("records");
    const result = await collection.deleteMany(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("No records found to delete");
    }
    res.status(200).send({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting records");
  }
});
*/


export default router;