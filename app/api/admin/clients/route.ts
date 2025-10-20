import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
    const adminPass = req.headers.get("x-admin-pass");
    if (adminPass !== "seo123")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const res = await pool.query(
        "SELECT  slug FROM clients ORDER BY slug ASC"
    );
    return NextResponse.json({ clients: res.rows });
}
