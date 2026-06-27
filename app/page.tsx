import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 rounded-full border border-emerald-400/30 px-4 py-1 text-sm text-emerald-200">Private notes, scoped per user</p>
      <h1 className="text-5xl font-bold tracking-tight">Verc Note</h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-300">
        A minimal, secure personal notepad built for Vercel with Next.js App Router, Auth.js, Prisma, Postgres, and Tailwind.
      </p>
      <div className="mt-10 flex gap-4">
        <Link className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300" href={session ? "/notes" : "/login"}>
          {session ? "Open notes" : "Sign in"}
        </Link>
        <a className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-900" href="https://vercel.com" rel="noreferrer" target="_blank">
          Vercel ready
        </a>
      </div>
    </main>
  );
}
