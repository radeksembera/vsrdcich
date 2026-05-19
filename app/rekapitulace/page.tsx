"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import PageShell from "@/components/PageShell";

function buildSpaydString(account: string, amount: number, vs: string, message: string): string {
  const [accountNumber, bankCode] = account.split("/");
  const iban = `CZ${bankCode}${accountNumber.padStart(16, "0")}`;
  return `SPD*1.0*ACC:${iban}*AM:${amount}.00*CC:CZK*X-VS:${vs}*MSG:${message}`;
}

function RekapitulaceContent() {
  const searchParams = useSearchParams();
  const vs = searchParams.get("vs") ?? "";
  const amount = Number(searchParams.get("amount") ?? 399);
  const account = searchParams.get("account") ?? "";
  const id = searchParams.get("id") ?? "";

  const [qrDataUrl, setQrDataUrl] = useState("");
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (!account || !vs) return;
    const spayd = buildSpaydString(account, amount, vs, "VSrdcich");
    QRCode.toDataURL(spayd, { width: 240, margin: 2, color: { dark: "#2c1810" } })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [account, vs, amount]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/memorial/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;
        setPageUrl(`${base}/${data.slug}`);
      });
  }, [id]);

  return (
    <PageShell
      step={4}
      title="Platba a rekapitulace"
      subtitle="Vaše objednávka byla přijata. Po zaplacení vám dojde potvrzení na e-mail."
    >
      <div className="space-y-6">
        <div className="bg-[#fdf0e4] border border-[#e8c99e] rounded-xl p-6 space-y-3">
          <h2 className="font-semibold text-[#6b4c3b] text-lg">Platební údaje</h2>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-[#a08060]">Částka</span>
            <span className="font-semibold text-[#2c1810] text-base">{amount} Kč</span>

            <span className="text-[#a08060]">Číslo účtu</span>
            <span className="font-mono font-medium">{account}</span>

            <span className="text-[#a08060]">Variabilní symbol</span>
            <span className="font-mono font-semibold text-[#6b4c3b]">{vs}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm font-medium text-[#6b4c3b]">QR platba</p>
          {qrDataUrl ? (
            <div className="border-4 border-[#e8d5be] rounded-2xl p-3 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR platba" width={200} height={200} />
            </div>
          ) : (
            <div className="w-[200px] h-[200px] border-4 border-[#e8d5be] rounded-2xl bg-white flex items-center justify-center text-[#a08060] text-sm">
              Načítám QR...
            </div>
          )}
          <p className="text-xs text-[#a08060] text-center max-w-xs">
            Naskenujte QR kódem v mobilní aplikaci vaší banky
          </p>
        </div>

        {pageUrl && (
          <div className="border border-[#e8d5be] rounded-xl px-5 py-4 bg-white">
            <p className="text-sm text-[#a08060] mb-1">Adresa pamětní stránky</p>
            <p className="font-mono text-[#6b4c3b] text-sm break-all">{pageUrl}</p>
          </div>
        )}

        <div className="bg-[#f0f4f9] border border-blue-100 rounded-xl px-5 py-4 text-sm text-[#4a6080]">
          <p>
            Po zaplacení vám dojde potvrzení na e-mail a stránka bude zveřejněna.
            Fyzický QR kód vám zašleme poštou do{" "}
            <strong>5–7 pracovních dnů</strong>.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

export default function RekapitulacePage() {
  return (
    <Suspense>
      <RekapitulaceContent />
    </Suspense>
  );
}
