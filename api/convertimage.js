const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const router = express.Router();

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing Image",
    message: "The app is working properly!",
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads_convert_image/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.use("/uploads_convert_image", express.static("uploads_convert_image"));

router.post("/upload", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;
  const processedImagePath = `processed_${req.file.originalname}`;
  const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

  let format = "jpeg";

  if (fileExtension === "png") {
    format = "png";
  }

  sharp(imagePath)
    .resize({
      width: 800,
      height: 600,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toColorspace("srgb")
    .jpeg({ quality: 50 })
    .toFormat(format)
    .toFile(`uploads_convert_image/${processedImagePath}`, (error, info) => {
      fs.unlink(imagePath, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting temporary file:", unlinkError);
        }
      });

      if (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Image processing failed" });
      } else {
        const processedImageUrl = `/uploads_convert_image/${processedImagePath}`;
        const imageDetails = {
          processedImageSize: info.size,
          processedImageWidth: info.width,
          processedImageHeight: info.height,
        };
        res.json({ processedImageUrl, imageDetails });
      }
    });
});

router.get("/download/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = `uploads_convert_image/${imageName}`;

  res.setHeader("Content-Type", "image/jpeg");

  res.download(imagePath, (error) => {
    if (error) {
      console.error("Error downloading image:", error);
      res.status(500).send("Error downloading image");
    }
  });
});

module.exports = router;
