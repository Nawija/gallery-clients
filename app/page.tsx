import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center gap-5 min-h-screen ">
      <Link href="/strefa-klienta">Strefa Klienta</Link>
      <Link href="/admin/new-client">New client</Link>
    </div>
  );
}
