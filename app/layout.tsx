import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VSrdcich – Vzpomínky, které zůstanou",
  description:
    "Vytvořte digitální vzpomínkovou stránku pro své blízké. Uchovejte jejich příběh navždy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
