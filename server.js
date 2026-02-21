require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { query } = require('./resumeRAG');
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


// Routes
app.get("/", (req, response) => {
  response.json({ message: "CORS is enabled for all origins! GET" });
});


app.post("/resume/question", async (request, response) => {
  console.log("Question", request.body, request.body.question);

  let result;
  try {

    result = await query(request.body.question);
    response.json({
      answer: result,
      question: request.body
    })
  } catch (err) {
    console.error(`Error posting question :` + err);
    response.json({
      error: err
    })
  };

  console.log('server post question result: ', result);
  return result;
});

//server listen

app.listen(process.env.PORT || 5004, () => {
  console.log("Server running on", process.env.PORT);
});


//serve frontend
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});