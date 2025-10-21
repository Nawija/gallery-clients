"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClientForm() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const router = useRouter();

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
                router.push("/admin/add-photos");
            }, 500);
        } else {
            const err = await res.json();
            setStatus("❌ Error: " + (err.error || "Something went wrong"));
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="font-semibold text-gray-700 -mb-8 ml-1 z-10 px-2 bg-gray-100 w-max">
                    Client name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 p-3 pl-3 rounded focus:outline-none focus:ring focus:ring-gray-300 transition"
                    required
                />
                <label className="font-semibold text-gray-700 -mb-8 ml-1 z-10 px-2 bg-gray-100 w-max">
                    Slug (link)
                </label>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="border border-gray-300 p-3 pl-3 rounded focus:outline-none focus:ring focus:ring-gray-300 transition"
                    required
                />
                <label className="font-semibold text-gray-700 -mb-8 ml-1 z-10 px-2 bg-gray-100 w-max">
                    Password
                </label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-3 pl-3 rounded focus:outline-none focus:ring focus:ring-gray-300 transition"
                    required
                />

                <button
                    type="submit"
                    className="bg-black text-gray-100 py-3 rounded font-semibold hover:bg-gray-800 transition"
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
