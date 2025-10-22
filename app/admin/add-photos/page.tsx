// app/admin/add-photos/page.tsx
import Nav from "@/components/admin/Nav";
import UploadForm from "@/components/admin/UploadForm";
export const dynamic = "force-dynamic";

type Client = {
    slug: string;
};

async function getClients(): Promise<Client[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/clients`,
        {
            method: "POST",
            headers: { "x-admin-pass": "seo123" },
            cache: "no-store", // zawsze świeże dane
        }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.clients;
}

export default async function UploadPhotosPage() {
    const clients = await getClients();

    return (
        <div className="min-h-screen">
            <Nav />
            <UploadForm clients={clients} />
        </div>
    );
}
