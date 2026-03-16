require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (ONLY ROUTES HERE)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/violations", require("./routes/violationRoutes"));

app.get("/", (req, res) => {
  res.send("ECIS Backend Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});