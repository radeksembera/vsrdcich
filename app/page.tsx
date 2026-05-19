import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf6ef] flex flex-col">
      <header className="border-b border-[#e8d5be] bg-white/60">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <span className="text-xl font-semibold text-[#6b4c3b]">🕊️ VSrdcich</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="text-6xl mb-6">🕊️</span>
        <h1 className="text-4xl font-semibold text-[#6b4c3b] mb-4 max-w-xl">
          Vzpomínky, které zůstanou
        </h1>
        <p className="text-[#a08060] text-lg max-w-lg mb-10">
          Vytvořte krásnou digitální vzpomínkovou stránku pro svého blízkého.
          Uchovejte jejich příběh, fotografie a vzpomínky navždy.
        </p>

        <Link
          href="/rozlouceni"
          className="bg-[#6b4c3b] hover:bg-[#5a3d2e] text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors"
        >
          Vytvořit vzpomínkovou stránku
        </Link>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl text-left">
          {[
            { icon: "✍️", title: "Vyplníte údaje", desc: "Jméno, data a krátký příběh o svém blízkém" },
            { icon: "🤖", title: "AI vytvoří stránku", desc: "Krásná personalizovaná stránka během minuty" },
            { icon: "📮", title: "QR kód poštou", desc: "Obdržíte fyzický QR kód, který stránku otevře" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-[#e8d5be] p-5">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-[#6b4c3b] mb-1">{item.title}</h3>
              <p className="text-sm text-[#a08060]">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
