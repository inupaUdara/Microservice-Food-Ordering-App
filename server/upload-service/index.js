const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./src/config/mongodb");
const Image = require("./src/models/image.model");

const app = express();
const port = process.env.PORT || 5000;
const uploadDir = process.env.UPLOAD_DIR || "uploads";

// Create the "uploads" folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Connect to MongoDB
connectDB();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

// API route for uploading an image
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Create an entry in MongoDB with the file metadata
  try {
    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    await newImage.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
      imageId: newImage._id, // Return the image ID from MongoDB
    });
  } catch (error) {
    res.status(500).json({ error: "Error saving to database" });
  }
});

app.listen(port, () => {
  console.log(`Upload Service running on http://localhost:${port}`);
});
