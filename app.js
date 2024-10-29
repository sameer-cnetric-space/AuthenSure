require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const routes = require("./routes");
const startServer = require("./server");

const app = express();

// Middleware for secure HTTP headers
app.use(helmet());

// CORS middleware to allow requests from different origins
app.use(cors());

// Compression middleware for better performance
app.use(compression());

//Serving  static files
app.use(express.static("public"));

// Rate limiting to prevent too many requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res
      .status(429)
      .send({ message: "Too many requests, please try again later." });
  },
});
app.use(limiter);

// HTTP request logger
app.use(morgan("dev"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Body parser middleware for parsing JSON request bodies
app.use(express.json());

// Use app routes
app.use("/api/v1", routes);

//Not Found  Middleware
app.use((req, res, next) => {
  res.status(404).send({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ message: "Something went wrong!", error: err.message });
});

// Start the server
startServer(app);

// Graceful shutdown logic
const gracefulShutdown = (signal) => {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log("HTTP server closed");

    // Close the database connection
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0); // Exit process after all cleanups
    });
  });

  // Set a timeout to forcefully shut down if cleanup takes too long (optional)
  setTimeout(() => {
    console.error("Forcefully shutting down");
    process.exit(1);
  }, 10000); // Force shutdown after 10 seconds
};

// Handle process termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Handle Ctrl+C (SIGINT)
