// app/admin/add-photos/page.tsx
import UploadForm from "@/components/admin/UploadForm";

export default function UploadPhotosPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Upload Photos</h2>
            <UploadForm />
        </div>
    );
}
