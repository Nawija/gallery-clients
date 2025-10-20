import { NextResponse } from "next/server";
import crypto from "crypto";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, slug, password } = await req.json();

    if (!name || !slug || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Sprawdź, czy klient o tym slugu już istnieje
    const exists = await pool.query("SELECT * FROM clients WHERE slug = $1", [slug]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    // Proste, lekkie "hashowanie" (nie bcrypt)
    const password_hash = crypto.createHash("sha256").update(password).digest("hex");

    const result = await pool.query(
      "INSERT INTO clients (name, slug, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, slug, password_hash]
    );

    return NextResponse.json({ client: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error adding client:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
