import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center gap-5 min-h-screen ">
      <Link href="/admin">Admin</Link>
      <Link href="/admin/new-client">New client</Link>
    </div>
  );
}
