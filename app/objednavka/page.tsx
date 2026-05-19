"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";

function ObjednavkaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const [creatorEmail, setCreatorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    street: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/memorial/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCreatorEmail(data.creatorEmail ?? "");
        setForm((prev) => ({ ...prev, email: data.creatorEmail ?? "" }));
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId: id, ...form }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Nastala chyba");
        return;
      }

      const data = await res.json();
      router.push(
        `/rekapitulace?id=${id}&vs=${data.variableSymbol}&amount=${data.amount}&account=${encodeURIComponent(data.bankAccount)}`
      );
    } catch {
      setError("Nepodařilo se odeslat objednávku");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      step={3}
      title="Objednávka"
      subtitle="Stránka bude zveřejněna po objednání a zaplacení QR kódu."
    >
      <div className="space-y-6">
        <div className="bg-[#f0f9f0] border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <span className="text-green-600 text-xl">✓</span>
          <div>
            <p className="font-semibold text-green-800">Stránka úspěšně uložena</p>
            <p className="text-sm text-green-700">
              Ke zveřejnění dojde po objednání QR kódu.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
              Jméno a příjmení (příjemce zásilky)
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Jana Nováková"
              className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
              E-mail pro potvrzení
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
            />
            {form.email !== creatorEmail && creatorEmail && (
              <p className="text-xs text-[#a08060] mt-1">
                Předvyplněno z prvního kroku:{" "}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, email: creatorEmail })}
                  className="underline hover:text-[#6b4c3b]"
                >
                  {creatorEmail}
                </button>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
              Ulice a číslo popisné
            </label>
            <input
              type="text"
              required
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              placeholder="Hlavní 123"
              className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
                Město
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Praha"
                className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
                PSČ
              </label>
              <input
                type="text"
                required
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                placeholder="110 00"
                className="w-full border border-[#e8d5be] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7]"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#6b4c3b] hover:bg-[#5a3d2e] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {submitting ? "Odesílám..." : "Přejít k rekapitulaci →"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

export default function ObjednavkaPage() {
  return (
    <Suspense>
      <ObjednavkaForm />
    </Suspense>
  );
}
