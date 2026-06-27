import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNote } from "./actions";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  // Layout already guarantees a session, but we still read the id here to scope
  // the query — never trust a parent to have filtered for us.
  const session = await auth();
  const userId = session!.user.id;

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, content: true, updatedAt: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Your notes</h1>
        <form action={createNote}>
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            New note
          </button>
        </form>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">
            No notes yet. Create your first one.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/notes/${note.id}`}
                className="block rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                <h2 className="truncate font-medium">{note.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {note.content || "Empty note"}
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  Updated {formatDate(note.updatedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
