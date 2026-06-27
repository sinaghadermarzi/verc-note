import Link from "next/link";
import { signOut } from "@/auth";

export function AppHeader({
  userName,
  userEmail,
}: {
  userName?: string | null;
  userEmail?: string | null;
}) {
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/notes" className="text-base font-semibold tracking-tight">
          Secure Notepad
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-neutral-500 sm:inline">
            {userName ?? userEmail}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
