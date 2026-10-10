import mysql, { type Pool, type PoolOptions } from "mysql2/promise";

const globalForDb = globalThis as unknown as { mysqlPool?: Pool };

export function dbConfig() {
  const database = process.env.MYSQL_DATABASE || "serendrift";
  if (!/^[A-Za-z0-9_]+$/.test(database)) {
    throw new Error("MYSQL_DATABASE may only contain letters, numbers, and underscores.");
  }

  const config: PoolOptions = {
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: "Z",
    charset: "utf8mb4",
  };

  if (process.env.MYSQL_SOCKET) {
    config.socketPath = process.env.MYSQL_SOCKET;
  } else {
    config.host = process.env.MYSQL_HOST || "127.0.0.1";
    config.port = Number(process.env.MYSQL_PORT || 3306);
  }

  return { database, config };
}

export function getPool() {
  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool(dbConfig().config);
  }
  return globalForDb.mysqlPool;
}

export async function closePool() {
  if (!globalForDb.mysqlPool) return;
  const pool = globalForDb.mysqlPool;
  globalForDb.mysqlPool = undefined;
  await pool.end();
}

export function isDuplicateEntry(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ER_DUP_ENTRY");
}
