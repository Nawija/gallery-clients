// app/admin/layout.tsx
import AdminNav from "@/components/admin/AdminNav";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-900 ">
            <AdminNav />
            <main className="max-w-5xl mx-auto mt-10 p-6">{children}</main>
        </div>
    );
}
