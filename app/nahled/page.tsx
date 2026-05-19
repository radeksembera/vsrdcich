"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";

function NahledForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const [html, setHtml] = useState("");
  const [feedback, setFeedback] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/memorial/${id}`)
      .then((r) => r.json())
      .then((data) => setHtml(data.generatedHtml ?? ""))
      .catch(() => setError("Nepodařilo se načíst stránku"));
  }, [id]);

  async function handleRegenerate() {
    setRegenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/memorial/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHtml(data.html);
      setFeedback("");
    } catch {
      setError("Přegenerování selhalo");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/memorial/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedHtml: html }),
      });
      if (!res.ok) throw new Error();
      router.push(`/objednavka?id=${id}`);
    } catch {
      setError("Uložení selhalo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell
      step={2}
      title="Náhled stránky"
      subtitle="Zkontrolujte vygenerovanou stránku. Pokud chcete něco upravit, napište připomínky a přegenerujte."
    >
      <div className="space-y-6">
        {html ? (
          <div className="border border-[#e8d5be] rounded-xl overflow-hidden">
            <div className="bg-[#f5ece2] px-4 py-2 text-xs text-[#a08060] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
              <span className="ml-2">Náhled stránky</span>
            </div>
            <iframe
              srcDoc={html}
              className="w-full h-[500px]"
              title="Náhled pamětní stránky"
              sandbox="allow-same-origin"
            />
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-[#a08060] border border-[#e8d5be] rounded-xl">
            {error ? error : "Načítám náhled..."}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
            Připomínky k přegenerování (nepovinné)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Co chcete změnit? Napiste pripominky..."
            rows={3}
            className="w-full border border-[#e8d5be] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7] resize-y"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleRegenerate}
            disabled={regenerating || saving}
            className="flex-1 border-2 border-[#d4a574] text-[#6b4c3b] hover:bg-[#fdf0e4] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {regenerating ? "Přegeneruji..." : "↺ Přegenerovat"}
          </button>
          <button
            onClick={handleSave}
            disabled={!html || saving || regenerating}
            className="flex-1 bg-[#6b4c3b] hover:bg-[#5a3d2e] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Ukládám..." : "Uložit a pokračovat →"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

export default function NahledPage() {
  return (
    <Suspense>
      <NahledForm />
    </Suspense>
  );
}
