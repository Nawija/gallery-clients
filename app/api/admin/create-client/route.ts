import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
    const adminPass = req.headers.get("x-admin-pass");
    if (adminPass !== process.env.ADMIN_PASSWORD)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, slug, password } = await req.json();
    if (!name || !slug || !password)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const passwordHash = hashPassword(password);

    const res = await pool.query(
        "INSERT INTO clients (name, slug, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [name, slug, passwordHash]
    );

    return NextResponse.json({ client: res.rows[0] });
}
