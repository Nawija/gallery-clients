import { NextResponse } from "next/server";
import crypto from "crypto";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { slug, password } = await req.json();
        if (!slug || !password)
            return NextResponse.json(
                { error: "Missing data" },
                { status: 400 }
            );

        const clientRes = await pool.query(
            "SELECT * FROM clients WHERE slug = $1",
            [slug]
        );
        if (clientRes.rows.length === 0)
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );

        const client = clientRes.rows[0];
        const hash = crypto.createHash("sha256").update(password).digest("hex");

        if (hash !== client.password_hash)
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 401 }
            );

        // Jeśli hasło poprawne, zwróć dane klienta (bez hasła)
        return NextResponse.json({
            id: client.id,
            name: client.name,
            slug: client.slug,
        });
    } catch (err) {
        console.error("❌ Error verifying password:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
