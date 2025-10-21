import Link from "next/link";

export default function Nav() {
    return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0">
            <p className="font-semibold text-xl">Panel Admin</p>
            <Link
                href="/admin/add-client"
                className="text-emerald-500 hover:text-emerald-400 hover:border-emerald-200 font-semibold py-2 px-4 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-lg border border-emerald-500"
            >
                Add Client
            </Link>
        </div>
    );
}
