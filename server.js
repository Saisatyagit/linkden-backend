const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploads folder (for images/videos)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/posts", require("./routes/postRoutes"));

// ✅ Async function to start server
const serverStart = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Start Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Start the server
serverStart();
