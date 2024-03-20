const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const app = express();
const config = require('./config');
const PORT = 3090;

app.use(cors())

app.use(bodyParser.json());
app.get("/gemini", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) {
    res.status(400).send("Error: Provide a prompt");
  }
  const api_key = config.API_KEY;
  if (!api_key) {
    res.status(401).send("Error: API_KEY environment variable not set");
  }
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = result.response || "Unable to fetch content";
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(response,null,2));
});
app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
})
