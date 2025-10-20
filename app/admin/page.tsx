import UploadForm from "@/components/UploadForm";

export default function AdminPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Panel Admina</h1>
            <UploadForm />
        </div>
    );
}
