"use client";

import Image from "next/image";
import { useState } from "react";

type ShimmerImageProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

export default function ShimmerImage({
    src,
    alt,
    width,
    height,
}: ShimmerImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-300 via-gray-200 to-gray-300" />
            )}
            
        </div>
    );
}
