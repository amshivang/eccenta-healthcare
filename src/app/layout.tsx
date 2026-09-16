import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "EccenTa – Smart Healthcare Ecosystem",
  description:
    "AI-powered Smart Healthcare Ecosystem connecting patients, doctors, hospitals, pharmacies, laboratories, and emergency services.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
