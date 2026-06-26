const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");

const app = express();
const PORT = 4000;
const MONGO_URI = "mongodb://127.0.0.1:27017/notes_management";

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Validation error",
        errors: {
          ...(!title && { title: "Title is required" }),
          ...(!content && { content: "Content is required" })
        }
      });
    }

    const note = new Note({ title, content });
    await note.save();

    res.status(201).json({ message: "Note created successfully", note });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/notes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Validation error",
        errors: {
          ...(!title && { title: "Title is required" }),
          ...(!content && { content: "Content is required" })
        }
      });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }

    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Notes API running on port ${PORT}`);
});
