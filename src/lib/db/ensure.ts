import fs from "fs";
import path from "path";
import type { RowDataPacket } from "mysql2";
import mysql from "mysql2/promise";
import { defaultContent } from "../seed";
import { saveSiteContent } from "./content";
import { dbConfig, getPool } from "./pool";

let ready: Promise<void> | null = null;

function statements(sql: string) {
  return sql
    .split(/;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

async function prepare() {
  const { database, config } = dbConfig();
  const admin = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    socketPath: config.socketPath,
    multipleStatements: false,
  });

  try {
    await admin.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await admin.end();
  }

  const schema = fs.readFileSync(path.join(process.cwd(), "src/lib/db/schema.sql"), "utf8");
  const pool = getPool();
  for (const statement of statements(schema)) {
    await pool.query(statement);
  }

  const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM site_profile WHERE id = 1");
  if (rows.length === 0) await saveSiteContent(defaultContent);
}

export function ensureDatabase() {
  if (!ready) {
    ready = prepare().catch((error: unknown) => {
      ready = null;
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ER_ACCESS_DENIED_ERROR" || code === "ECONNRESET") {
        throw new Error(
          "Could not connect to MySQL. Check MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE in .env.local, then run npm run db:setup.",
          { cause: error },
        );
      }
      throw error;
    });
  }
  return ready;
}
