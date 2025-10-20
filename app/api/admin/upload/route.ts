import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";

export async function POST(req: Request) {
  const adminPass = req.headers.get("x-admin-pass");

  // 🔒 proste zabezpieczenie hasłem admina
  if (adminPass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, filename, dataBase64, caption } = await req.json();

  if (!clientId || !filename || !dataBase64) {
    return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
  }

  try {
    // 🔍 Znajdź klienta po slugu (np. "jan-kowalski") zamiast UUID
    const clientRes = await pool.query("SELECT id FROM clients WHERE slug = $1", [clientId]);

    if (clientRes.rows.length === 0) {
      return NextResponse.json({ error: "Nie znaleziono klienta o podanym slugu" }, { status: 404 });
    }

    const uuidClientId = clientRes.rows[0].id;

    // 🔼 Upload pliku do Cloudflare R2
    const buffer = Buffer.from(dataBase64, "base64");
    const key = `${uuidClientId}/${Date.now()}-${filename}`;
    await uploadToR2(key, buffer, "image/jpeg");

    // 💾 Zapisz dane zdjęcia w bazie
    const result = await pool.query(
      `INSERT INTO photos (client_id, filename, r2_key, caption)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [uuidClientId, filename, key, caption || null]
    );

    return NextResponse.json({ photo: result.rows[0] });
  } catch (err: any) {
    console.error("❌ Upload error:", err);
    return NextResponse.json({ error: "Błąd podczas uploadu" }, { status: 500 });
  }
}
