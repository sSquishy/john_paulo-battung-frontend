import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "web3_dapp",
  password: process.env.PG_PASSWORD || "123123123",
  port: Number(process.env.PG_PORT) || 5432,
});
