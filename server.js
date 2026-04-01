import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // verifies pool can reach MySQL before accepting traffic

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running at PORT ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err.message);
      process.exit(1);
    });

  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  }
};

startServer();