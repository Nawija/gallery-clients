"use client";

import UploadForm from "@/components/UploadForm";
import { useState } from "react";

export default function NewClientPage() {
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
        } else {
            const err = await res.json();
            setStatus("❌ Error: " + (err.error || "Something went wrong"));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2">
                {/* Form Add Client */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        Add New Client
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Client name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <input
                            type="text"
                            placeholder="Slug (e.g. anna-nowak)"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            type="submit"
                            className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition font-semibold"
                        >
                            Add Client
                        </button>
                    </form>
                    {status && (
                        <p className="mt-4 text-center text-sm font-medium">
                            {status}
                        </p>
                    )}
                </div>

                {/* Upload Form */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <UploadForm />
                </div>
            </div>
        </div>
    );
}
