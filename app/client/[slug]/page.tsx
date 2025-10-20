"use client";

import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export default function ClientGalleryPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [photos, setPhotos] = useState<any[]>([]);

    // Sprawdź czy klient już zalogowany
    useEffect(() => {
        const token = localStorage.getItem(`client_${slug}_auth`);
        if (token === "true") {
            setIsAuthorized(true);
            fetchPhotos();
        }
    }, [slug]);

    // Photoswipe inicjalizacja
    useEffect(() => {
        if (isAuthorized) {
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

        const res = await fetch("/api/client/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, password }),
        });

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
        const res = await fetch(`/api/client/photos?slug=${slug}`);
        if (res.ok) {
            const data = await res.json();
            setPhotos(data.photos);
        }
    }

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-2xl font-semibold mb-4">Private Gallery</h1>
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-3 w-64"
                >
                    <input
                        type="password"
                        placeholder="Enter password"
                        className="border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-black text-white p-2 rounded hover:bg-gray-800 transition"
                    >
                        Log in
                    </button>
                </form>
                {error && <p className="text-red-600 mt-3">{error}</p>}
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-semibold mb-6 text-center">
                Client Gallery
            </h1>
            <div
                id="gallery"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            >
                {photos.map((photo) => (
                    <a
                        key={photo.id}
                        href={`https://${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${photo.r2_key}`}
                        data-pswp-width="1600"
                        data-pswp-height="1067"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img
                            src={`https://${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${photo.r2_key}`}
                            alt={photo.filename}
                            className="w-full h-48 object-cover rounded-lg shadow-md hover:opacity-90"
                        />
                    </a>
                ))}
            </div>
        </div>
    );
}
