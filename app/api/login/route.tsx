import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        console.log("📩 Received password:", password);

        // 🔑 Tworzymy hash SHA256 (tak jak w /api/client/verify)
        const hash = crypto.createHash("sha256").update(password).digest("hex");

        // 🔍 Szukamy klienta po hash'u
        const res = await pool.query(
            "SELECT slug FROM clients WHERE password_hash = $1",
            [hash]
        );

        console.log("🔍 Found rows:", res.rows);

        if (res.rows.length === 0)
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );

        const client = res.rows[0];

        // 🔒 Tworzymy JWT
        const token = jwt.sign(
            { slug: client.slug },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "7d" }
        );

        // 🍪 Zwracamy token w cookie
        const response = NextResponse.json({ slug: client.slug });
        response.cookies.set("client_auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60, // 7 dni
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("❌ Login error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
