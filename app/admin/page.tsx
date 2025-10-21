"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                // Zapis w localStorage zamiast cookie
                localStorage.setItem(`client_${data.slug}_auth`, "true");
                // Przekierowanie do strony klienta
                router.push(`/client/${data.slug}`);
            } else {
                setError(data.error || "Login error");
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError("Server error");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-center mb-4">
                    Admin Login
                </h1>
                <input
                    type="password"
                    placeholder="Enter client password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                    {loading ? "Checking..." : "Login"}
                </button>
                {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                )}
            </form>
        </div>
    );
}
