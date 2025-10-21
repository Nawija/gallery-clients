// app/admin/add-client/page.tsx
import AddClientForm from "@/components/admin/AddClientForm";

export default function AddClientPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
            <AddClientForm />
        </div>
    );
}
