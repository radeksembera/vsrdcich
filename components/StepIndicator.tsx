"use client";

const STEPS = [
  { label: "Rozloučení", path: "/rozlouceni" },
  { label: "Vytvoření", path: "/vytvoreni" },
  { label: "Náhled", path: "/nahled" },
  { label: "Objednávka", path: "/objednavka" },
  { label: "Rekapitulace", path: "/rekapitulace" },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step.path} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  i < current
                    ? "bg-[#d4a574] border-[#d4a574] text-white"
                    : i === current
                      ? "bg-[#6b4c3b] border-[#6b4c3b] text-white"
                      : "bg-white border-[#d4a574] text-[#d4a574]"
                }`}
              >
                {i < current ? "✓" : i + 1}
              </div>
              <span
                className={`mt-1 text-xs hidden sm:block ${
                  i === current ? "text-[#6b4c3b] font-semibold" : "text-[#a08060]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-16 mx-1 ${
                  i < current ? "bg-[#d4a574]" : "bg-[#e8d5be]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
