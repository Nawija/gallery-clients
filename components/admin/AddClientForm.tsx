"use client";

import { useState } from "react";

export default function AddClientForm() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Loading...");

        const res = await fetch("/api/admin/new-client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, slug, password }),
        });

        if (res.ok) {
            setStatus("✅ Client added successfully!");
            setName("");
            setSlug("");
            setPassword("");
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            const err = await res.json();
            setStatus("❌ Error: " + (err.error || "Something went wrong"));
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Add New Client
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="text"
                    placeholder="Client name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                />
                <input
                    type="text"
                    placeholder="Slug (e.g. anna-nowak)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                />

                <button
                    type="submit"
                    className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                    Add Client
                </button>
            </form>

            {status && (
                <p className="mt-4 text-center text-sm font-medium text-gray-600">
                    {status}
                </p>
            )}
        </div>
    );
}
