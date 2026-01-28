import express from "express";
import cors from "cors";
import accountRoute from "./routes/account.js";
import dotenv from "dotenv";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Mount account routes
app.use("/api/account", accountRoute);

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Connect Redis before accepting requests
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
