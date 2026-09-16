import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Pool is created lazily so that the module can be imported at build time
// without DATABASE_URL being present. The check happens at request time.
const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsMysqlPool?: mysql.Pool;
};

function getPool(): mysql.Pool {
  if (globalForDb.__arenaNextJsMysqlPool) {
    return globalForDb.__arenaNextJsMysqlPool;
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  const pool = mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: 10,
  });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsMysqlPool = pool;
  }
  return pool;
}

// Proxy so existing `import { db } from "@/db"` callers work unchanged.
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return drizzle(getPool())[prop as keyof ReturnType<typeof drizzle>];
  },
});

export const pool = new Proxy({} as mysql.Pool, {
  get(_target, prop) {
    return getPool()[prop as keyof mysql.Pool];
  },
});
