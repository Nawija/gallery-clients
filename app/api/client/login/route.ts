import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { comparePassword, signClientSession } from "@/lib/auth";

export async function POST(req: Request) {
    const { slug, password } = await req.json();
    const res = await pool.query("SELECT * FROM clients WHERE slug = $1", [
        slug,
    ]);
    const client = res.rows[0];
    if (!client)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!comparePassword(password, client.password_hash))
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = signClientSession(client.id);
    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: "client_session",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}
