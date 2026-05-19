import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf6ef] flex flex-col">
      <header className="border-b border-[#e8d5be] bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
          <span className="text-xl font-semibold text-[#6b4c3b]">🕊️ V Srdcích</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero */}
        <section className="w-full max-w-2xl mx-auto px-6 pt-12 pb-10 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4a2e1e] mb-6 leading-tight">
            Vzpomínky, které zůstanou
          </h1>

          <div className="w-full rounded-2xl overflow-hidden shadow-lg mb-8">
            <Image
              src="/hero.jpg"
              alt="Vzpomínková stránka s QR kódem na náhrobku"
              width={1024}
              height={576}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          <p className="text-[#7a5c40] text-lg max-w-md mb-8">
            Vytvořte krásnou digitální vzpomínkovou stránku pro svého blízkého.
            Uchovejte jejich příběh, fotografie a vzpomínky navždy.
          </p>

          <Link
            href="/rozlouceni"
            className="bg-[#4a2e1e] hover:bg-[#3a2010] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-md"
          >
            Vytvořit vzpomínkovou stránku
          </Link>
        </section>

        {/* Selling points */}
        <section className="w-full bg-[#8b7355] py-10 px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 items-center justify-items-center">
            {/* Badge 1 – 15 let garance */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white/70 flex flex-col items-center justify-center text-white text-center px-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mb-1 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="text-xs font-bold tracking-widest leading-tight mt-0.5">15 LET</span>
                <span className="text-xs font-bold tracking-widest leading-tight">GARANCE</span>
              </div>
            </div>

            {/* Badge 2 – Zaplatíte jenom jednou */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white/70 flex flex-col items-center justify-center text-white text-center px-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <span className="text-xs font-bold tracking-widest leading-tight">ZAPLATÍTE</span>
                <span className="text-xs font-bold tracking-widest leading-tight">JENOM</span>
                <span className="text-xs font-bold tracking-widest leading-tight">JEDNOU</span>
              </div>
            </div>

            {/* Badge 3 – Posíláme po celé ČR */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white/70 flex flex-col items-center justify-center text-white text-center px-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mb-1 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="text-xs font-bold tracking-widest leading-tight">POSÍLÁME</span>
                <span className="text-xs font-bold tracking-widest leading-tight">PO CELÉ</span>
                <span className="text-xs font-bold tracking-widest leading-tight">ČR</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
