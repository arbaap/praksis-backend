const express = require("express");
const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const router = express.Router();

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing Audio",
    message: "The app is working properly!",
  });
});

router.use("/uploads_convert_audio", express.static("uploads_convert_audio"));

const storage = multer.memoryStorage(); // Menggunakan memory storage

const upload = multer({ storage });

router.post("/upload", upload.single("audio"), (req, res) => {
  if (req.file) {
    const { originalname, mimetype, size } = req.file;
    res.json({
      message: "File uploaded successfully",
      originalname,
      mimetype,
      size,
    });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

router.post("/convert", upload.single("audio"), (req, res) => {
  if (req.file) {
    const { format } = req.body;
    const audioBuffer = req.file.buffer; // Mengambil Buffer dari file audio

    ffmpeg(audioBuffer) // Menggunakan Buffer sebagai input ffmpeg
      .toFormat(format)
      .toBuffer((err, convertedBuffer) => {
        if (err) {
          console.error("Error converting file:", err);
          res.status(500).json({ message: "Error converting file" });
        } else {
          const convertedFileSize = convertedBuffer.length;

          const convertedFileDetails = {
            name: uuidv4() + "." + format,
            type: format,
            size: convertedFileSize,
          };

          res.json({
            message: "File converted successfully",
            convertedFileDetails,
          });
        }
      });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join("uploads_convert_audio", filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ message: "Error downloading file" });
    }
  });
});

module.exports = router;
