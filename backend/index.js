const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pinsRouter = require("./routes/pins"); // Import the router
const usersRouter = require("./routes/users"); // Import the router
const cors = require('cors'); // Import the cors package


// Enable all CORS requests

dotenv.config();


const app = express();
const PORT = process.env.PORT || 8800;
app.use(cors());

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use("/api/pins", pinsRouter); // Mount the router
app.use("/api/users", usersRouter); // Mount the router


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
