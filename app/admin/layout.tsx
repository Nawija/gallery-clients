import AdminNav from "@/components/admin/AdminNav";
import Nav from "@/components/admin/Nav";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex bg-gray-100 text-gray-800">
            {/* Sidebar po lewej */}
            <AdminNav />

            {/* Główna treść */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
