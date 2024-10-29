const mongoose = require("mongoose");
const connectDB = require("./config/db");

const startServer = async (app) => {
  try {
    // Connect to the database
    connectDB();

    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return server; // Return the server instance for later use (shutdown)
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1); // Exit process if the database connection fails
  }
};

module.exports = startServer;
