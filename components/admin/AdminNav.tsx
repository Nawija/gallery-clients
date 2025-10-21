"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `px-4 py-2 rounded-lg font-medium ${
            pathname === path
                ? "bg-gray-300 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } transition`;

    return (
        <nav className="shadow bg-white sticky top-0 z-50">
            <div className="flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto">
                <Link href="/admin" className="font-semibold text-2xl">Admin Panel</Link>
                <div className="space-x-4">
                    <Link
                        href="/admin/add-client"
                        className={linkClass("/admin/add-client")}
                    >
                        Add Client
                    </Link>
                    <Link
                        href="/admin/add-photos"
                        className={linkClass("/admin/add-photos")}
                    >
                        Upload Photos
                    </Link>
                </div>
            </div>
        </nav>
    );
}
