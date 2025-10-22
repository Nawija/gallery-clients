"use client";

import { useState } from "react";

import UploadForm from "@/components/admin/UploadForm";
import AdminNav from "@/components/admin/AdminNav";
import AddClientForm from "@/components/admin/AddClientForm";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<"client" | "upload">("client");

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-900">
            {/* NAVIGATION */}
            <AdminNav activeTab={activeTab} onChange={setActiveTab} />

            {/* CONTENT */}
            <main className="max-w-5xl mx-auto mt-10 p-6">
                {activeTab === "client" ? <AddClientForm /> : <UploadForm />}
            </main>
        </div>
    );
}
