"use client";

import { useEffect, useState } from "react";
import { ImageIcon, UploadCloud, X, XCircle } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

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
    const [isDragging, setIsDragging] = useState(false);
    const [uploads, setUploads] = useState<UploadPhoto[]>([]);
    const [msg, setMsg] = useState("");

    // Fetch clients on mount
    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch(`/api/admin/clients`, {
                    headers: { "x-admin-pass": "seo123" },
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("Failed to fetch clients");
                const data = await res.json();

                setClients(data.clients);
                setClientId(data.clients[0]?.slug || "");
            } catch (error) {
                console.error("❌ Error fetching clients:", error);
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
                isHero: i === index ? !u.isHero : u.isHero,
            }))
        );
    }

    function removeUpload(index: number) {
        setUploads((prev) => prev.filter((_, i) => i !== index));
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
            setMsg("⚠️ Please choose a client and add files first.");
            return;
        }

        setMsg(`Uploading ${uploads.length} file(s)...`);
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
                if (res.ok) results.push(`✅ ${photo.file.name}`);
                else results.push(`❌ ${photo.file.name}: ${data.error}`);
            } catch {
                results.push(`❌ ${photo.file.name}: server error`);
            }
        }

        setMsg(results.join("\n"));
        setUploads([]);
    }

    return (
        <form
            onSubmit={handleUpload}
            className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 space-y-8 transition-all hover:shadow-2xl"
        >
            {/* HEADER */}
            <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">
                    Upload Photos
                </h3>
                <p className="text-gray-500 text-sm">
                    Choose a client and upload images with captions.
                </p>
            </div>

            {/* SELECT CLIENT */}
            <div className="space-y-2">
                <label className="block font-semibold text-gray-700">
                    Select Client
                </label>
                <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-0"
                >
                    {clients.map((c) => (
                        <option key={c.slug} value={c.slug}>
                            {c.slug}
                        </option>
                    ))}
                </select>
            </div>

            {/* UPLOAD AREA */}
            <div className="border-dashed border-2 border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-50 transition">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                    id="fileUpload"
                />

                <label
                    htmlFor="fileUpload"
                    className="flex flex-col items-center justify-center gap-3 cursor-pointer select-none"
                >
                    <motion.div
                        animate={{
                            y: isDragging ? -2 : 0,
                            opacity: isDragging ? 0.8 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <UploadCloud
                            className={`w-10 h-10 ${
                                isDragging ? "text-black" : "text-gray-400"
                            } transition-colors`}
                        />
                    </motion.div>

                    <div className="space-y-1">
                        <p
                            className={`text-base font-medium ${
                                isDragging ? "text-black" : "text-gray-700"
                            } transition-colors`}
                        >
                            {isDragging
                                ? "Drop files to upload"
                                : "Drag & drop your photos"}
                        </p>
                        {!isDragging && (
                            <p className="text-sm text-gray-400">
                                or{" "}
                                <span className="underline">
                                    click to select
                                </span>
                            </p>
                        )}
                    </div>
                </label>
            </div>

            {/* PREVIEWS */}
            {uploads.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {uploads.map((u, i) => (
                        <motion.div
                            key={i}
                            className="relative rounded-sm overflow-hidden bg-white border border-gray-200"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                        >
                            {/* PHOTO */}
                            <div className="relative w-full h-48 bg-white flex items-center justify-center">
                                <img
                                    src={u.preview}
                                    alt={u.file.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-48 object-contain p-2"
                                />
                            </div>

                            {/* REMOVE BUTTON */}
                            <button
                                type="button"
                                onClick={() => removeUpload(i)}
                                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-sm hover:bg-red-50 transition"
                            >
                                <X className="w-4 h-4 text-red-500" />
                            </button>

                            <div className="p-3 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Caption..."
                                    value={u.caption}
                                    onChange={(e) =>
                                        updateCaption(i, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 transition"
                                />
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={u.isHero}
                                        onChange={() => toggleHero(i)}
                                        className="accent-black"
                                    />
                                    Główne zdjecie
                                </label>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all"
            >
                Upload Photos
            </button>

            {/* STATUS */}
            {msg && (
                <pre className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm text-gray-800 whitespace-pre-wrap mt-4 overflow-auto max-h-40">
                    {msg}
                </pre>
            )}
        </form>
    );
}
