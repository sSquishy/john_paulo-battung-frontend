import express from "express";
import cors from "cors";
import accountRoute from "./routes/account.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount account routes
app.use("/api/account", accountRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
