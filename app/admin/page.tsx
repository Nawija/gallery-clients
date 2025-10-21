// app/admin/page.tsx
import Nav from "@/components/admin/Nav";
import Image from "next/image";
import Link from "next/link";

type Client = {
    name: string;
    slug: string;
    heroImage: string;
};

const r2Domain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN?.startsWith("http")
    ? process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN
    : `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}`;

async function getClients(): Promise<Client[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/clients_hero`,
        {
            headers: {
                "x-admin-pass": "seo123",
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch clients");
    }

    const data = await res.json();
    return data.clients;
}
export default async function AdminHome() {
    const clients = await getClients();

    return (
        <>
            <Nav />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {clients.map((client) => {
                    const photoUrl = `${r2Domain}/${client.heroImage}`;
                    return (
                        <Link
                            key={client.slug}
                            href={`/strefa-klienta/${client.slug}`}
                            className="overflow-hidden relative"
                        >
                            <Image
                                src={photoUrl}
                                alt={client.name}
                                width={300}
                                height={200}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-2 text-start font-semibold text-sm">
                                {client.name}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
