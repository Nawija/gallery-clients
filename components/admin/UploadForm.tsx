"use client";

import { useEffect, useState } from "react";
import { UploadCloud, XCircle, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "../loading/ProgressBar";

type UploadPhoto = {
    file: File;
    preview: string;
    caption: string;
    isHero: boolean;
    status?: "pending" | "uploaded" | "error";
};

type Client = {
    slug: string;
};

export default function UploadForm() {
    const [clients, setClients] = useState<Client[]>([]);
    const [clientId, setClientId] = useState("");
    const [uploads, setUploads] = useState<UploadPhoto[]>([]);
    const [msg, setMsg] = useState("");
    const [progress, setProgress] = useState(0);

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

        setMsg(""); // clear previous messages
        setProgress(0);

        const total = uploads.length;
        let uploadedCount = 0;
        const results: string[] = [];

        for (let i = 0; i < uploads.length; i++) {
            const photo = uploads[i];

            setUploads((prev) =>
                prev.map((u, idx) =>
                    idx === i ? { ...u, status: "pending" } : u
                )
            );

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

                if (res.ok) {
                    results.push(`✅ ${photo.file.name}`);
                    setUploads((prev) =>
                        prev.map((u, idx) =>
                            idx === i ? { ...u, status: "uploaded" } : u
                        )
                    );
                } else {
                    const data = await res.json();
                    results.push(`❌ ${photo.file.name}: ${data.error}`);
                    setUploads((prev) =>
                        prev.map((u, idx) =>
                            idx === i ? { ...u, status: "error" } : u
                        )
                    );
                }
            } catch {
                results.push(`❌ ${photo.file.name}: server error`);
                setUploads((prev) =>
                    prev.map((u, idx) =>
                        idx === i ? { ...u, status: "error" } : u
                    )
                );
            }

            uploadedCount++;
            setProgress(Math.round((uploadedCount / total) * 100));
            setMsg(results.join("\n")); // aktualizuj status text live
        }
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                >
                    {clients.map((c) => (
                        <option key={c.slug} value={c.slug}>
                            {c.slug}
                        </option>
                    ))}
                </select>
            </div>
            {/* UPLOAD AREA */}
            <div
                className="border-dashed border-2 border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-50 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    if (
                        e.dataTransfer.files &&
                        e.dataTransfer.files.length > 0
                    ) {
                        handleFiles({
                            target: { files: e.dataTransfer.files },
                        } as any);
                        e.dataTransfer.clearData();
                    }
                }}
            >
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
                    className="flex flex-col items-center justify-center space-y-3 cursor-pointer"
                >
                    <UploadCloud className="w-10 h-10 text-gray-400" />
                    <span className="font-medium text-gray-700">
                        Drag & drop files or{" "}
                        <span className="underline">click to upload</span>
                    </span>
                    <span className="text-sm text-gray-400">
                        JPG, PNG up to 10MB
                    </span>
                </label>
            </div>

            {/* PREVIEWS */}
            {uploads.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {uploads.map((u, i) => (
                        <div
                            key={i}
                            className="relative group rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                            <img
                                src={u.preview}
                                alt={u.file.name}
                                className="w-full h-48 object-cover"
                            />

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => removeUpload(i)}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-red-100 transition"
                            >
                                <XCircle className="w-5 h-5 text-red-500" />
                            </button>

                            {/* STATUS ICON */}
                            {u.status === "uploaded" && (
                                <CheckCircle className="absolute bottom-2 right-2 w-6 h-6 text-green-500 bg-white/80 rounded-full shadow" />
                            )}

                            {u.status === "error" && (
                                <XCircle className="absolute bottom-2 right-2 w-6 h-6 text-red-500 bg-white/80 rounded-full shadow" />
                            )}

                            <div className="p-3 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Caption..."
                                    value={u.caption}
                                    onChange={(e) =>
                                        updateCaption(i, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                                />
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={u.isHero}
                                        onChange={() => toggleHero(i)}
                                        className="accent-black"
                                    />
                                    Główne zdjęcie
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* SUBMIT BUTTON */}
            {progress < 1 && (
                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all"
                >
                    Upload Photos
                </button>
            )}
            {/* PROGRESS BAR */}

            {progress > 0 && <ProgressBar progress={progress} />}

            {/* STATUS TEXT */}
            {uploads.length > 0 && (
                <pre className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm text-gray-800 whitespace-pre-wrap mt-4 overflow-auto max-h-40">
                    {uploads
                        .filter(
                            (u) =>
                                u.status === "uploaded" || u.status === "error"
                        )
                        .map((u) =>
                            u.status === "uploaded"
                                ? `✅ ${u.file.name}`
                                : `❌ ${u.file.name}`
                        )
                        .join("\n")}
                </pre>
            )}
        </form>
    );
}
