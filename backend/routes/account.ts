import { Router } from "express";
import { getBalance, getGasPrice, getBlockNumber, getTransactions } from "../utils/eth.js";

const router = Router();

// GET /api/account?address=0x123...
router.get("/", async (req, res) => {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Missing address query parameter" });
  }

  try {
    // Fetch all three in parallel
    const [balance, gasPrice, blockNumber] = await Promise.all([
      getBalance(address),
      getGasPrice(),
      getBlockNumber()
    ]);

    res.json({
      balance,
      gasPrice,
      blockNumber
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch account data" });
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
