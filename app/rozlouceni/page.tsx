"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";

export default function RozlouceniPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    deceasedName: "",
    birthDate: "",
    deathDate: "",
    creatorEmail: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/memorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Nastala chyba");
        return;
      }

      const { id } = await res.json();
      router.push(`/vytvoreni?id=${id}`);
    } catch {
      setError("Nepodařilo se připojit k serveru");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      step={0}
      title="Rozloučení"
      subtitle="Uchovejte vzpomínku na svého blízkého pro všechny, kteří ho milovali."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
            Jméno a příjmení zesnulého / zesnulé
          </label>
          <input
            type="text"
            required
            value={form.deceasedName}
            onChange={(e) => setForm({ ...form, deceasedName: e.target.value })}
            placeholder="např. Marie Nováková"
            className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
              Datum narození
            </label>
            <input
              type="date"
              required
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
              Datum úmrtí
            </label>
            <input
              type="date"
              required
              value={form.deathDate}
              onChange={(e) => setForm({ ...form, deathDate: e.target.value })}
              className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
            Váš e-mail
          </label>
          <input
            type="email"
            required
            value={form.creatorEmail}
            onChange={(e) => setForm({ ...form, creatorEmail: e.target.value })}
            placeholder="vas@email.cz"
            className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6b4c3b] hover:bg-[#5a3d2e] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Připravuji..." : "Navrhnout stránku →"}
        </button>
      </form>
    </PageShell>
  );
}
