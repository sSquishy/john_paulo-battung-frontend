// frontend/src/blockchain.ts

// Account data type returned from backend
export type AccountData = {
  balance: string;      // ETH balance
  gasPrice: string;     // current gas price in gwei
  blockNumber: number;  // current Ethereum block number
};

export async function getAccountData(address: string): Promise<AccountData> {
  try {
    const res = await fetch(`http://localhost:4000/api/account?address=${address}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error("Error fetching account data from backend:", error);
    return { balance: "0", gasPrice: "0", blockNumber: 0 };
  }
}

// Add proper window.ethereum type declaration for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

/** Connect to MetaMask and return the selected address */
export async function connectWallet(): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask is not installed');

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    if (!accounts || accounts.length === 0) throw new Error('No accounts found');
    return accounts[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to connect wallet');
    }
  }
}

/** Transaction type */
export type SimpleTx = {
  hash: string;
  from: string;
  to: string | null;
  value: string;      // in ETH
  blockNumber: string;
};

/** Fetch last 10 transactions from backend */
export async function getTransactions(address: string): Promise<SimpleTx[]> {
  try {
    const res = await fetch(`http://localhost:4000/api/account/transactions?address=${address}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error('Error fetching transactions from backend:', error);
    return [];
  }
}
