"use client";

import { useEffect, useState } from "react";
import { Lock, LogOut } from "lucide-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import Link from "next/link";
import { motion } from "framer-motion";

type Photo = {
    id: string;
    r2_key: string;
    filename: string;
    width: number;
    height: number;
    is_hero: boolean;
};

export default function ClientGalleryPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [heroPhoto, setHeroPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState<string>("");

    const r2Domain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN?.startsWith(
        "http"
    )
        ? process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN
        : `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}`;

    useEffect(() => {
        const token = localStorage.getItem(`client_${slug}_auth`);
        if (token === "true") {
            setIsAuthorized(true);
            fetchPhotos();
        }
    }, [slug]);

    useEffect(() => {
        if (isAuthorized && photos.length > 0) {
            const lightbox = new PhotoSwipeLightbox({
                gallery: "#gallery",
                children: "a",
                pswpModule: () => import("photoswipe"),
            });
            lightbox.init();
            return () => lightbox.destroy();
        }
    }, [isAuthorized, photos]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/client/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, password }),
        });

        setLoading(false);

        if (res.ok) {
            localStorage.setItem(`client_${slug}_auth`, "true");
            setIsAuthorized(true);
            fetchPhotos();
        } else {
            const err = await res.json();
            setError(err.error || "Login failed");
        }
    }

    async function fetchPhotos() {
        setLoading(true);
        const res = await fetch(`/api/client/photos?slug=${slug}`);
        if (res.ok) {
            const data = await res.json();
            console.log("API response:", data);
            setPhotos(data.photos);
            setClientName(data.name);
            const hero = data.photos.find((p: Photo) => p.is_hero);
            setHeroPhoto(hero || null);
        }
        setLoading(false);
    }

    function handleLogout() {
        localStorage.removeItem(`client_${slug}_auth`);
        setIsAuthorized(false);
        setPhotos([]);
    }

    useEffect(() => {
        async function fetchHero() {
            const res = await fetch(`/api/client/photos?slug=${slug}`);
            if (res.ok) {
                const data = await res.json();
                setPhotos(data.photos);
                const hero = data.photos.find((p: Photo) => p.is_hero);
                setHeroPhoto(hero || null);
            }
        }

        fetchHero();
    }, [slug]);

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4 relative">
                {heroPhoto && (
                    <>
                        <img
                            src={`${r2Domain}/${heroPhoto.r2_key}`}
                            alt={heroPhoto.filename}
                            className="absolute inset-0 w-full h-full object-cover -z-10"
                        />
                        <div className="absolute inset-0 bg-black/80" />
                    </>
                )}

                <form
                    onSubmit={handleLogin}
                    className="relative flex flex-col items-center justify-center gap-3 w-full max-w-xs bg-black/30 border border-white/20 p-10 shadow-lg z-10 backdrop-blur-sm"
                >
                    <div className="text-[#83574aee] mb-6 flex items-center justify-center flex-col">
                        <Lock size={73} />
                        <p>Wprowadz hasło</p>
                    </div>
                    <input
                        type="password"
                        placeholder="Hasło"
                        className="border w-full border-gray-300 bg-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-black w-full text-white py-2 rounded hover:bg-gray-800 transition"
                    >
                        {loading ? "Sprawdzam..." : "Zaloguj"}
                    </button>
                </form>

                {error && (
                    <p className="relative z-10 text-red-600 mt-3 text-sm font-medium">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-[#833017] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Hero Photo */}
            {heroPhoto && (
                <div className="relative w-full h-[97vh] overflow-hidden">
                    <motion.img
                        src={`${r2Domain}/${heroPhoto.r2_key}`}
                        alt={heroPhoto.filename}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/10 to-black/40 pointer-events-none"></div>

                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 sm:p-10 bg-white/10 border border-white shadow-xl text-center max-w-xl backdrop-blur-xs z-10"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.5,
                            ease: "easeOut",
                        }}
                    >
                        <motion.h1
                            className="text-xl font-semibold text-white drop-shadow-lg"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                        >
                            Galleria
                        </motion.h1>
                        <motion.p
                            className="text-7xl font-light text-white drop-shadow-lg mb-8 mt-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.9 }}
                        >
                            {clientName}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                        >
                            <Link
                                href="#gallery"
                                className="text-gray-400 bg-white px-4 py-2 rounded hover:bg-white/90 transition"
                            >
                                Zobacz zdjęcia
                            </Link>
                        </motion.div>
                    </motion.div>

                    <div className="absolute top-1/4 left-0 w-1/3 h-[2px] bg-white/80 rounded-full shadow-md"></div>
                    <div className="absolute bottom-1/4 right-0 w-1/3 h-[2px] bg-white/80 rounded-full shadow-md"></div>
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>
            )}

            {/* Top bar with logout */}
            <div className="flex items-center justify-between p-3">
                <p className="text-gray-700">Fotograf Jarek Olszewski</p>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Masonry / Justified gallery */}
            <div
                id="gallery"
                className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2 scroll-m-3"
            >
                {photos.map((photo) => {
                    const photoUrl = `${r2Domain}/${photo.r2_key}`;
                    const aspectRatio = photo.width / photo.height;
                    return (
                        <a
                            key={photo.id}
                            href={photoUrl}
                            data-pswp-width={photo.width}
                            data-pswp-height={photo.height}
                            target="_blank"
                            rel="noreferrer"
                            className="break-inside-avoid mb-2 block w-full overflow-hidden shadow-md transition-opacity duration-500 opacity-0 animate-fadeIn"
                        >
                            <img
                                src={photoUrl}
                                alt={photo.filename}
                                width={photo.width}
                                height={photo.height}
                                style={{ aspectRatio }}
                                className="w-full h-auto object-cover"
                                onLoad={(e) =>
                                    (e.currentTarget.parentElement!.style.opacity =
                                        "1")
                                }
                            />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
