import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
    const adminPass = req.headers.get("x-admin-pass");
    if (adminPass !== "seo123") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await pool.query(`
        SELECT 
            c.id,
            c.name,
            c.slug,
            p.r2_key AS "heroImage"
        FROM clients c
        LEFT JOIN photos p
            ON p.client_id = c.id AND p.is_hero = true
        ORDER BY c.name ASC
    `);

    return NextResponse.json({ clients: res.rows });
}
