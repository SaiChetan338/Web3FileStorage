const express = require("express");
const cors = require("cors");
const multer = require("multer");
const lighthouse = require("@lighthouse-web3/sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const response = await lighthouse.uploadBuffer(
      req.file.buffer,
      process.env.LIGHTHOUSE_API_KEY
    );

    res.json({ url: `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
