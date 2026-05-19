"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";

function VytvoreniForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const [inputText, setInputText] = useState("");
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const body = new FormData();
        body.append("memorialId", id);
        body.append("orderIndex", String(photos.length + i));
        body.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body });

        if (!res.ok) throw new Error("Nahrávání selhalo");
        const { publicUrl } = await res.json();

        setPhotos((prev) => [...prev, { url: publicUrl, name: file.name }]);
      }
    } catch {
      setError("Nepodařilo se nahrát fotografie");
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerate() {
    if (!id) { setError("Chybí ID stránky"); return; }
    setGenerating(true);
    setError("");

    try {
      const res = await fetch(`/api/memorial/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText,
          photoUrls: photos.map((p) => p.url),
        }),
      });

      if (!res.ok) throw new Error("Generování selhalo");
      router.push(`/nahled?id=${id}`);
    } catch {
      setError("Nepodařilo se vygenerovat stránku");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <PageShell
      step={1}
      title="Vytvoření stránky"
      subtitle="Sdělte nám o svém blízkém co nejvíce – my se postaráme o krásné zpracování."
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#6b4c3b] mb-1">
            Vzpomínky, příběhy, povahové rysy...
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Napište cokoliv, co chcete zachovat. Oblíbená místa, koníčky, vzpomínky na společné chvíle, životní příběh..."
            rows={10}
            className="w-full border border-[#e8d5be] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4a574] bg-[#fdfaf7] resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6b4c3b] mb-2">
            Fotografie
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />

          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {photos.map((p, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#e8d5be]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 border-2 border-dashed border-[#d4a574] text-[#6b4c3b] hover:bg-[#fdf0e4] rounded-lg px-5 py-3 transition-colors disabled:opacity-50"
          >
            {uploading ? "Nahrávám..." : "+ Přidat fotografie"}
          </button>
          <p className="text-xs text-[#a08060] mt-1">
            Podporované formáty: JPG, PNG, WebP
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating || uploading}
          className="w-full bg-[#6b4c3b] hover:bg-[#5a3d2e] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <span className="animate-spin">⏳</span>
              Generuji stránku (může trvat až minutu)...
            </>
          ) : (
            "Vytvořit stránku →"
          )}
        </button>
      </div>
    </PageShell>
  );
}

export default function VytvoreniPage() {
  return (
    <Suspense>
      <VytvoreniForm />
    </Suspense>
  );
}
