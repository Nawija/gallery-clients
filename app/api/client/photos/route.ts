import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug)
        return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const clientRes = await pool.query(
        "SELECT id, name FROM clients WHERE slug = $1",
        [slug]
    );

    if (clientRes.rows.length === 0)
        return NextResponse.json(
            { error: "Client not found" },
            { status: 404 }
        );

    const clientId = clientRes.rows[0].id;
    const clientName = clientRes.rows[0].name;

    const photosRes = await pool.query(
        "SELECT id, r2_key, filename, width, height, is_hero FROM photos WHERE client_id = $1 ORDER BY created_at ASC",
        [clientId]
    );

    return NextResponse.json({ photos: photosRes.rows, name: clientName });
}
