import fs from "fs";
import path from "path";

function loadEnvFile(file: string) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env"));
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  const { ensureDatabase } = await import("../src/lib/db/ensure");
  const { closePool } = await import("../src/lib/db/pool");
  await ensureDatabase();
  await closePool();
  console.log(`MySQL database "${process.env.MYSQL_DATABASE || "serendrift"}" is ready.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "MySQL setup failed.";
  console.error(message);
  process.exit(1);
});
