const express = require("express");
const app = express();
const cors = require("cors");
const convertAudio = require("./convertaudio");
const convertImage = require("./convertimage");
const mergeAudio = require("./mergeaudio");

app.use(express.json());
app.use(cors());

app.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

app.use("/audio", convertAudio);
app.use("/image", convertImage);
app.use("/maudio", mergeAudio);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port", port));
