import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function hashPassword(password: string) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export function comparePassword(password: string, hash: string) {
    return hashPassword(password) === hash;
}

export function signClientSession(clientId: string) {
    return jwt.sign({ clientId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyClientSession(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as {
            clientId: string;
            iat: number;
            exp: number;
        };
    } catch {
        return null;
    }
}
