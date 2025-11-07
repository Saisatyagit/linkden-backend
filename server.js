// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoutes");

const app = express();

// -------------------- MIDDLEWARE -------------------- //
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Serve uploads folder (images/videos)
app.use("/uploads", express.static("uploads"));

// -------------------- ROOT ROUTE -------------------- //
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// -------------------- API ROUTES -------------------- //
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// -------------------- START SERVER -------------------- //
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");

    // Start Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Call the function to start server
startServer();
