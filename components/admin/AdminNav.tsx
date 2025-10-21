"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `block p-4 font-medium ${
            pathname === path
                ? "bg-gray-100 text-black"
                : "bg-white text-gray-700 hover:bg-gray-200"
        } transition`;

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
            <Link
                href="/admin"
                className="font-bold text-sm mb-4.5 flex items-center justify-between gap-2 p-4"
            >
                <div className="flex items-center justify-center gap-1">
                    <div className="bg-gray-300 p-1 rounded-full">
                        <User size={16} />
                    </div>
                    <p>Admin</p>
                </div>
            </Link>

            <nav className="flex flex-col">
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
            </nav>
        </aside>
    );
}
