import UploadForm from "@/components/UploadForm";
import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Panel Admina</h1>
            <Link href="/admin/new-client">New Client</Link>
        </div>
    );
}
