"use client";

type Props = {
    activeTab: "client" | "upload";
    onChange: (tab: "client" | "upload") => void;
};

export default function AdminNav({ activeTab, onChange }: Props) {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
                <h1 className="text-xl font-bold tracking-tight">
                    📸 Admin Panel
                </h1>

                <div className="flex gap-4">
                    <button
                        onClick={() => onChange("client")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "client"
                                ? "bg-black text-white shadow-md"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        🧍 Add Client
                    </button>

                    <button
                        onClick={() => onChange("upload")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === "upload"
                                ? "bg-black text-white shadow-md"
                                : "text-gray-600 hover:text-black"
                        }`}
                    >
                        🖼️ Upload Photos
                    </button>
                </div>
            </div>
        </nav>
    );
}
