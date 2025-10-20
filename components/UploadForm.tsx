"use client";
import { useState } from "react";

export default function UploadForm() {
  const [clientId, setClientId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [msg, setMsg] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || files.length === 0) {
      setMsg("Podaj Client ID i wybierz pliki");
      return;
    }

    setMsg(`Wysyłam ${files.length} plików...`);

    const results: string[] = [];

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-pass": "seo123" // na razie hardcoded
          },
          body: JSON.stringify({
            clientId,
            filename: file.name,
            dataBase64: base64,
            caption
          })
        });

        const data = await res.json();
        if (res.ok) results.push(file.name);
        else results.push(`${file.name} ❌ ${data.error}`);
      } catch (err) {
        results.push(`${file.name} ❌ server error`);
      }
    }

    setMsg("Wyniki:\n" + results.join("\n"));
    setFiles([]);
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4 bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Upload zdjęć dla klienta (multi)</h3>

      <div>
        <label className="block text-sm mb-1">Client ID</label>
        <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)}
          className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm mb-1">Pliki</label>
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      </div>

      <div>
        <label className="block text-sm mb-1">Opis (opcjonalnie)</label>
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded px-3 py-2" />
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Wyślij</button>

      <pre className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{msg}</pre>
    </form>
  );
}
