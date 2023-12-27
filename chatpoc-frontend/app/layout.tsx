import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decision Chat",
  description: "Decision Chat AI Application Created by Jonah Lipsky",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 max-w-7xl w-full items-center justify-between font-mono text-lg lg:flex">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
