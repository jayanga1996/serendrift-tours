import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { ensureDatabase } from "@/lib/db/ensure";
import { dbConfig, getPool } from "@/lib/db/pool";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDatabase();
    const [rows] = await getPool().query<RowDataPacket[]>("SELECT 1 AS ok");
    return NextResponse.json({
      ok: rows[0]?.ok === 1,
      database: dbConfig().database,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "MySQL is not reachable.";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
