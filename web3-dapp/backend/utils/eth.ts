import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
if (!ALCHEMY_KEY) console.warn("Warning: No Alchemy key set in .env");

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`);

// Get ETH balance
export async function getBalance(address: string): Promise<string> {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// Get gas price
export async function getGasPrice(): Promise<string> {
  const feeData = await provider.getFeeData();
  if (!feeData.gasPrice) return "0";
  return Number(ethers.formatUnits(feeData.gasPrice, "gwei")).toFixed(7);
}

// Get current block number
export async function getBlockNumber(): Promise<number> {
  return provider.getBlockNumber();
}

// Get last 10 transactions for an address (dummy / demo version)
export async function getTransactions(address: string) {
  // For demo, just return fake last 10 txns
  return Array.from({ length: 10 }, (_, i) => ({
    hash: `0xFAKEHASH${i}`,
    from: address,
    to: "0xRECIPIENT...",
    value: (Math.random() * 0.01).toFixed(6),
  }));
}
