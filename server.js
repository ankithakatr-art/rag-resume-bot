require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { query } = require('./resumeRAG');
const path = require('node:path');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// API Routes
app.post("/resume/question", async (request, response) => {
  console.log("Question", request.body, request.body.question);
  let result;
  try {
    result = await query(request.body.question);
    response.json({ answer: result, question: request.body });
  } catch (err) {
    console.error(`Error posting question :` + err);
    response.json({ error: err });
  }
  console.log('server post question result: ', result);
  return result;
});

// Serve React frontend (must be after API routes, before listen)
app.use(express.static(path.join(__dirname, 'frontend/rag-resume-frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/rag-resume-frontend/dist/index.html'));
});

app.listen(process.env.PORT || 5004, () => {
  console.log("Server running on", process.env.PORT);
});