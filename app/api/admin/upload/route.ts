import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";
import sharp from "sharp";

// Typ dla wiersza w tabeli photos
type PhotoRow = {
    id: string;
    client_id: string;
    filename: string;
    r2_key: string;
    caption: string | null;
    width: number;
    height: number;
    is_hero: boolean;
    created_at: string; // timestamp
};

// Typ danych przesyłanych w body requestu
type UploadRequestBody = {
    clientId: string;
    filename: string;
    dataBase64: string;
    caption?: string;
    isHero?: boolean;
};

export async function POST(req: Request) {
    const adminPass = req.headers.get("x-admin-pass");
    if (adminPass !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
        clientId,
        filename,
        dataBase64,
        caption,
        isHero,
    }: UploadRequestBody = await req.json();

    if (!clientId || !filename || !dataBase64) {
        return NextResponse.json(
            { error: "Brak wymaganych danych" },
            { status: 400 }
        );
    }

    try {
        const clientRes = await pool.query(
            "SELECT id FROM clients WHERE slug = $1",
            [clientId]
        );
        if (clientRes.rows.length === 0) {
            return NextResponse.json(
                { error: "Nie znaleziono klienta" },
                { status: 404 }
            );
        }
        const uuidClientId = clientRes.rows[0].id;

        const buffer = Buffer.from(dataBase64, "base64");
        const key = `${uuidClientId}/${Date.now()}-${filename}`;
        await uploadToR2(key, buffer, "image/jpeg");

        const metadata = await sharp(buffer).metadata();
        const width = metadata.width || 1600;
        const height = metadata.height || 1067;

        // 🔹 Jeśli isHero = true, ustaw resztę zdjęć klienta na false
        if (isHero) {
            await pool.query(
                "UPDATE photos SET is_hero = FALSE WHERE client_id = $1",
                [uuidClientId]
            );
        }

        const result = await pool.query<PhotoRow>(
            `INSERT INTO photos (client_id, filename, r2_key, caption, width, height, is_hero)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [
                uuidClientId,
                filename,
                key,
                caption || null,
                width,
                height,
                isHero || false,
            ]
        );

        return NextResponse.json({ photo: result.rows[0] as PhotoRow });
    } catch (err: unknown) {
        console.error("❌ Upload error:", err);
        return NextResponse.json(
            { error: "Błąd podczas uploadu" },
            { status: 500 }
        );
    }
}
