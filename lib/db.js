import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "Crizz2004",
  database: process.env.PGDATABASE || "ecommerce_db",
  port: process.env.PGPORT || 5433,
});

export default pool;