"use client";

import { useEffect, useState } from "react";

type UploadPhoto = {
    file: File;
    preview: string;
    caption: string;
    isHero: boolean;
};

type Client = {
    slug: string;
};

export default function UploadForm() {
    const [clients, setClients] = useState<Client[]>([]);
    const [clientId, setClientId] = useState("");
    const [uploads, setUploads] = useState<UploadPhoto[]>([]);
    const [msg, setMsg] = useState("");

    // Fetch clients on mount
    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch("/api/admin/clients", {
                    headers: { "x-admin-pass": "seo123" },
                });
                if (res.ok) {
                    const data = await res.json();
                    setClients(data.clients);
                    if (data.clients.length > 0)
                        setClientId(data.clients[0].slug);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchClients();
    }, []);

    // Handle file selection
    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            caption: "",
            isHero: false,
        }));
        setUploads((prev) => [...prev, ...filesArray]);
    }

    function toggleHero(index: number) {
        setUploads((prev) =>
            prev.map((u, i) => ({
                ...u,
                isHero: i === index ? !u.isHero : false,
            }))
        );
    }

    function updateCaption(index: number, caption: string) {
        setUploads((prev) =>
            prev.map((u, i) => ({
                ...u,
                caption: i === index ? caption : u.caption,
            }))
        );
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!clientId || uploads.length === 0) {
            setMsg("Wybierz klienta i dodaj pliki");
            return;
        }

        setMsg(`Wysyłam ${uploads.length} plików...`);
        const results: string[] = [];

        for (const photo of uploads) {
            try {
                const buffer = await photo.file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString("base64");

                const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-pass": "seo123",
                    },
                    body: JSON.stringify({
                        clientId,
                        filename: photo.file.name,
                        dataBase64: base64,
                        caption: photo.caption,
                        isHero: photo.isHero,
                    }),
                });

                const data = await res.json();
                if (res.ok) results.push(photo.file.name);
                else results.push(`${photo.file.name} ❌ ${data.error}`);
            } catch {
                results.push(`${photo.file.name} ❌ server error`);
            }
        }

        setMsg("Wyniki:\n" + results.join("\n"));
        setUploads([]);
    }

    return (
        <form
            onSubmit={handleUpload}
            className="bg-linear-to-r from-green-50 to-green-100 p-6 rounded-2xl shadow-lg space-y-5"
        >
            <h3 className="text-2xl font-bold text-center text-green-800">
                Upload Client Photos
            </h3>

            <div>
                <label className="block font-medium mb-1 text-green-700">
                    Client
                </label>
                <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                >
                    {clients.map((c) => (
                        <option key={c.slug} value={c.slug}>
                            {c.slug}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block font-medium mb-2 text-green-700">
                    Files
                </label>
                <div className="border-dashed border-2 border-green-400 rounded-xl p-6 text-center cursor-pointer hover:bg-green-50 transition">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFiles}
                        className="w-full cursor-pointer"
                    />
                    <p className="text-green-600 mt-2">
                        Drag & drop or click to select
                    </p>
                </div>
            </div>

            {uploads.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploads.map((u, i) => (
                        <div
                            key={i}
                            className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white"
                        >
                            <img
                                src={u.preview}
                                alt={u.file.name}
                                className="w-32 h-20 object-cover"
                            />
                            <div className="p-2 space-y-1">
                                <input
                                    type="text"
                                    placeholder="Caption..."
                                    value={u.caption}
                                    onChange={(e) =>
                                        updateCaption(i, e.target.value)
                                    }
                                    className="w-full border border-green-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-sm"
                                />
                                <label className="flex items-center gap-2 text-green-700 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={u.isHero}
                                        onChange={() => toggleHero(i)}
                                        className="accent-green-500"
                                    />
                                    Hero Image
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold hover:bg-green-700 transition"
            >
                Upload
            </button>

            {msg && (
                <pre className="bg-green-50 p-3 rounded-xl text-green-900 text-sm whitespace-pre-wrap">
                    {msg}
                </pre>
            )}
        </form>
    );
}
