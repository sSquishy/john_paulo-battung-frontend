import { ethers } from "ethers";
import dotenv from "dotenv";
import { upsertAccount, getCache, setCache } from "../db/accountRepo.js";

dotenv.config();
console.log("Loaded ALCHEMY_KEY:", process.env.ALCHEMY_KEY);

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
if (!ALCHEMY_KEY) throw new Error("ALCHEMY_KEY missing in .env");

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`);

// Get ETH balance and store in PostgreSQL
export async function getBalance(address: string): Promise<string> {
  try {
    const balanceBN = await provider.getBalance(address);
    const balance = ethers.formatEther(balanceBN);
    await upsertAccount(address, balance);
    console.log(`Balance for ${address}: ${balance} ETH`);
    return balance;
  } catch (err) {
    console.error("Failed to fetch balance:", err);
    return "0";
  }
}

// Get gas price (cached in PostgreSQL)
export async function getGasPrice(): Promise<string> {
  try {
    const cached = await getCache("gasPrice");
    if (cached) {
      console.log("Using cached gasPrice:", cached);
      return cached;
    }

    const feeData = await provider.getFeeData();
    if (!feeData.maxFeePerGas) return "0";

    const gwei = Number(ethers.formatUnits(feeData.maxFeePerGas, "gwei")).toFixed(7);
    await setCache("gasPrice", gwei);
    console.log("Fetched gasPrice:", gwei);
    return gwei;
  } catch (err) {
    console.error("Failed to fetch gas price:", err);
    return "0";
  }
}

// Get current block number (cached in PostgreSQL)
export async function getBlockNumber(): Promise<number> {
  try {
    const cached = await getCache("blockNumber");
    if (cached) {
      console.log("Using cached blockNumber:", cached);
      return Number(cached);
    }

    const blockNumber = await provider.getBlockNumber();
    await setCache("blockNumber", blockNumber.toString());
    console.log("Fetched blockNumber:", blockNumber);
    return blockNumber;
  } catch (err) {
    console.error("Failed to fetch block number:", err);
    return 0;
  }
}

// Get last 10 transactions (dummy/demo)
export async function getTransactions(address: string) {
  return Array.from({ length: 10 }, (_, i) => ({
    hash: `0xFAKEHASH${i}`,
    from: address,
    to: "0xRECIPIENT...",
    value: (Math.random() * 0.01).toFixed(6),
  }));
}
