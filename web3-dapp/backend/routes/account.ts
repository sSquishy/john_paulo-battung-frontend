import { Router } from "express";
import { getBalance, getTransactions, getGasPrice, getBlockNumber } from "../utils/eth.js";

const router = Router();

// GET /api/account?address=0x123...
router.get("/", async (req, res) => {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Missing address query parameter" });
  }
  try {
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (err) {
    res.status(500).json({ error: "Failed to get balance" });
  }
});

// GET /api/account/transactions?address=0x123...
router.get("/transactions", async (req, res) => {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Missing address query parameter" });
  }
  try {
    const transactions = await getTransactions(address);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to get transactions" });
  }
});

export default router;
