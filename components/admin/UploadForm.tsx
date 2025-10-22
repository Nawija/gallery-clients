"use client";

import { useEffect, useState } from "react";
import { UploadCloud, XCircle, X, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "../loading/ProgressBar";
import Image from "next/image";

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
    const [isDragging, setIsDragging] = useState(false);
    const [uploads, setUploads] = useState<UploadPhoto[]>([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch(
                    `/api/admin/clients`,
                    {
                        headers: { "x-admin-pass": "seo123" },
                        cache: "no-store",
                    }
                );

                if (!res.ok) throw new Error("Failed to fetch clients");
                const data = await res.json();

                setClients(data.clients);
                setClientId(data.clients[0]?.slug || "");
            } catch (error) {
                console.error("❌ Error fetching clients:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchClients();
    }, []);

    // 🟡 Obsługa uploadu
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
        setProgress(0);
        setUploads((prev) => prev.map((u) => ({ ...u, status: "pending" })));

        const total = uploads.length;
        let completed = 0;

        await Promise.allSettled(
            uploads.map(async (photo, index) => {
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

                    if (!res.ok) throw new Error("Upload failed");

                    setUploads((prev) =>
                        prev.map((u, i) =>
                            i === index ? { ...u, status: "uploaded" } : u
                        )
                    );
                } catch {
                    setUploads((prev) =>
                        prev.map((u, i) =>
                            i === index ? { ...u, status: "error" } : u
                        )
                    );
                } finally {
                    completed++;
                    setProgress(Math.round((completed / total) * 100));
                }
            })
        );
    }

    // 🟢 Loading state
    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500 text-lg">
                Loading clients...
            </div>
        );
    }

    return (
        <form onSubmit={handleUpload} className="p-10 space-y-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Upload Photos</h2>
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

            <motion.div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);

                    if (
                        e.dataTransfer.files &&
                        e.dataTransfer.files.length > 0
                    ) {
                        const syntheticEvent = {
                            target: { files: e.dataTransfer.files },
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        handleFiles(syntheticEvent);
                        e.dataTransfer.clearData();
                    }
                }}
                animate={{
                    borderColor: isDragging ? "#111" : "#d1d5db",
                    backgroundColor: isDragging ? "#f9fafb" : "transparent",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="border-2 border-dashed rounded-xl p-12 h-52 text-center cursor-pointer transition-all bg-white"
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
            </motion.div>

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
                                <Image
                                    src={u.preview}
                                    alt={u.file.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-48 object-contain p-2"
                                />

                                {/* OVERLAY STATUS */}
                                <AnimatePresence mode="wait">
                                    {u.status === "pending" && (
                                        <motion.div
                                            key="pending"
                                            className="absolute inset-0 flex items-center justify-center animate-pulse bg-white/40 backdrop-blur-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.div
                                                className="w-8 h-8 border-[3px] border-white/40 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 1,
                                                    ease: "linear",
                                                }}
                                            />
                                        </motion.div>
                                    )}

                                    {u.status === "uploaded" && (
                                        <motion.div
                                            key="uploaded"
                                            className="absolute inset-0 bg-white/80 flex items-center justify-center"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 180,
                                                damping: 15,
                                            }}
                                        >
                                            <Check className="w-10 h-10 text-green-600" />
                                        </motion.div>
                                    )}

                                    {u.status === "error" && (
                                        <motion.div
                                            key="error"
                                            className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-[1px]"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 180,
                                                damping: 15,
                                            }}
                                        >
                                            <XCircle className="w-10 h-10 text-red-600 drop-shadow-md" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* REMOVE BUTTON */}
                            <button
                                type="button"
                                onClick={() => removeUpload(i)}
                                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-sm hover:bg-red-50 transition"
                            >
                                <X className="w-4 h-4 text-red-500" />
                            </button>

                            {/* CAPTION + HERO */}
                            <div className="p-4 space-y-3">
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
                                    Main photo
                                </label>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* SUBMIT BUTTON */}
            {progress < 1 && (
                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-800 transition-all"
                >
                    Upload Photos
                </button>
            )}
            {/* PROGRESS BAR */}

            {progress > 0 && <ProgressBar progress={progress} />}
        </form>
    );
}
