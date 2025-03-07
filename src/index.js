const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const db = require("./config/db");

// Routes
const commentRoutes = require("./routes/comment.routes");
const commentHistoryRoutes = require("./routes/commentHistory.routes");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Middleware log request
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`,
    req.body
  );
  next();
});

app.use("/api/comment", commentRoutes);
app.use("/api/comment-history", commentHistoryRoutes);

// const PORT = process.env.PORT || 5000;
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
