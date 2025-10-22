import UploadForm from "@/components/admin/UploadForm";

async function getClients() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/clients`,
        {
            headers: { "x-admin-pass": "seo123" },
            cache: "no-store",
        }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.clients;
}

export default async function UploadPhotosPage() {
    const clients = await getClients();
    return <UploadForm clients={clients} />;
}
