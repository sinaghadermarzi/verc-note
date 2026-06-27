import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verc Note",
  description: "A private notepad built with Next.js, Auth.js, Prisma, and Postgres."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
