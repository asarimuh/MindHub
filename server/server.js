import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;
const FOLDER_ID = process.env.FOLDER_ID;

// Proxy endpoint for Documents.js
app.get("/api/docs", async (req, res) => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}' in parents and trashed=false&fields=files(id,name,mimeType,webViewLink,iconLink,modifiedTime)&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to load documents." });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
