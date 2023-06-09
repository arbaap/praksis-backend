const express = require("express");
const app = express();
const cors = require("cors");
const convertaudio = require("./api/convertaudio.js");
const convertimage = require("./api/convertimage.js");
const mergeaudio = require("./api/mergeaudio.js");

app.use(express.json());
app.use(cors());

app.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

app.use("/convertaudio", convertaudio);
app.use("/convertimage", convertimage);
app.use("/mergeaudio", mergeaudio);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port", port));
