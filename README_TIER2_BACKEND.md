# Tier 2 Backend — README

Project Overview
----------------
This repository contains the backend component for a Web3 technical assessment (Tier 2). It is a small Node + Express + TypeScript service that exposes REST endpoints for querying Ethereum account data and recent transactions. The service integrates with an Ethereum JSON-RPC provider (Alchemy) via ethers.js.

API Endpoints
-------------
- `GET /api/account?address=<eth_address>`
  - Description: Returns account-level information for the provided Ethereum address.
  - Query param: `address` (required)
  - Response (200): JSON object containing `balance`, `gasPrice`, and `blockNumber`.

- `GET /api/account/transactions?address=<eth_address>`
  - Description: Returns the last 10 transactions for the provided address. In the current implementation this endpoint returns a demo/static list (see "Limitations").
  - Query param: `address` (required)
  - Response (200): JSON array of transaction objects.

Ethereum Network Integration
----------------------------
- Library: `ethers` (v6)
- Provider: `ethers.JsonRpcProvider` pointing to the Alchemy Sepolia RPC URL: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
- Data fetched from chain:
  - Account ETH balance via `provider.getBalance(address)`
  - Current gas price via `provider.getFeeData()` (formatted to Gwei)
  - Current block number via `provider.getBlockNumber()`

Data Returned (JSON examples)
-----------------------------
Example response from `GET /api/account?address=0x...`:

```json
{
  "balance": "0.123456789012345678",
  "gasPrice": "12.3456789",
  "blockNumber": 24298532
}
```

Notes:
- `balance` is returned as a string produced by `ethers.formatEther(...)` (raw ether value as string).
- `gasPrice` is returned as a string in Gwei with 7 decimals.
- `blockNumber` is returned as a number.

Example response from `GET /api/account/transactions?address=0x...` (current demo output):

```json
[
  { "hash": "0xFAKEHASH0", "from": "0x...", "to": "0xRECIPIENT...", "value": "0.003142" },
  { "hash": "0xFAKEHASH1", "from": "0x...", "to": "0xRECIPIENT...", "value": "0.005000" }
]
```

Project Structure
-----------------
Relevant backend files (root-level `backend/`):

- `server.ts` — Express server bootstrap. Enables CORS (restricted to `http://localhost:5173`) and JSON middleware. Mounts routes under `/api/account` and listens on `process.env.PORT || 4000`.
- `routes/account.ts` — Express Router implementing the two endpoints: `/` and `/transactions`. Validates `address` query parameter and calls util functions.
- `utils/eth.ts` — Ethereum helper functions using ethers.js:
  - `getBalance(address)` -> returns string (eth)
  - `getGasPrice()` -> returns string (gwei)
  - `getBlockNumber()` -> returns number
  - `getTransactions(address)` -> currently returns demo transaction list
- `package.json` — backend npm config and scripts (`build` and `dev`).
- `tsconfig.json` — TypeScript configuration for the backend.
- `.env` — example env file (contains `ALCHEMY_KEY` placeholder).

Setup & Run Instructions
------------------------
1. Ensure you are in the repository root and navigate to the `backend` folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Provide an Alchemy API key by creating a `.env` file in the `backend/` folder or editing the provided example:

```
ALCHEMY_KEY=your_real_alchemy_key_here
```

4. Build and run the backend (dev script compiles then runs compiled JS):

```bash
npm run dev
```

The server will start and listen on port `4000` by default. The server console prints `Backend server running on http://localhost:4000`.

Environment Variables
---------------------
- `ALCHEMY_KEY` (required for real network data): Alchemy API key for Sepolia RPC. If missing the server warns and `getTransactions` returns demo data.
- `PORT` (optional): port to listen on; defaults to `4000`.

Extensibility Notes
-------------------
- The code is intentionally small and modular:
  - `utils/eth.ts` centralizes Ethereum interaction, making it easy to add caching, batching, or swap providers.
  - `routes/account.ts` contains only request validation and orchestration; you can add middleware (rate limiting, auth) here.
- To add caching: integrate an in-memory cache (LRU) or Redis in `routes/account.ts` and store responses keyed by `address`.
- To persist transactions or events: add a database layer (e.g., Postgres, MongoDB) and record data in `getTransactions` or a separate ingestion worker.

Limitations / Current Implementation Notes
-----------------------------------------
- `getTransactions` currently returns a demo/static list for development. It does not query Alchemy's asset transfers API — replace with a real RPC/Alchemy call for production.
- There is no caching layer or database persistence implemented.
- Error handling is basic: endpoints return 500 on failures; there is no structured error code system yet.

Tier 2 Requirement Checklist
---------------------------
- REST API accepting Ethereum address: COMPLETED (`GET /api/account` and `/api/account/transactions`).
- Fetch gas price: COMPLETED (`getGasPrice()` uses `provider.getFeeData()`).
- Fetch current block number: COMPLETED (`getBlockNumber()`).
- Fetch account balance: COMPLETED (`getBalance()`).
- JSON response format: COMPLETED (all endpoints return JSON).
- Structured, extensible codebase: COMPLETED (separate `routes/` and `utils/` modules; TypeScript).

Bonus items (NOT implemented unless noted):
- Caching: NOT implemented.
- Database storage: NOT implemented.

Contact / Maintenance
---------------------
This is a lightweight assessment backend. For questions or to extend functionality (real transaction fetching, pagination, caching), update `utils/eth.ts` and `routes/account.ts` and add tests.

---
Generated: README_TIER2_BACKEND.md — documents the current backend implementation only.
