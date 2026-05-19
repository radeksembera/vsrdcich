import StepIndicator from "./StepIndicator";

export default function PageShell({
  children,
  step,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  step: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen bg-[#fdf6ef]">
      <header className="border-b border-[#e8d5be] bg-white/60 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">🕊️</span>
          <span className="text-xl font-semibold text-[#6b4c3b]">VSrdcich</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl shadow-sm border border-[#e8d5be] p-8">
          <h1 className="text-2xl font-semibold text-[#6b4c3b] mb-1">{title}</h1>
          {subtitle && <p className="text-[#a08060] mb-6">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}
