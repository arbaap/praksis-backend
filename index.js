const express = require("express");
const app = express();
const cors = require("cors");
const convertaudio = require("./api/convertaudio");
const convertimage = require("./api/convertimage");
const mergeaudio = require("./api/mergeaudio");

app.use(express.json());
app.use(cors());

app.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

app.use("/api/convertaudio", convertaudio);
app.use("/api/convertimage", convertimage);
app.use("/api/mergeaudio", mergeaudio);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port", port));
