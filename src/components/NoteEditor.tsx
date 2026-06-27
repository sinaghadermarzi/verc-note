"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { updateNote, deleteNote } from "@/app/notes/actions";

type Note = {
  id: string;
  title: string;
  content: string;
};

export function NoteEditor({ note }: { note: Note }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/notes"
          className="text-sm text-neutral-500 transition hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          ← All notes
        </Link>

        <form action={deleteNote}>
          <input type="hidden" name="id" value={note.id} />
          <DeleteButton />
        </form>
      </div>

      <form action={updateNote} className="grid gap-4">
        <input type="hidden" name="id" value={note.id} />

        <input
          name="title"
          defaultValue={note.title}
          placeholder="Title"
          maxLength={200}
          aria-label="Note title"
          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-lg font-medium outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-neutral-700"
        />

        <textarea
          name="content"
          defaultValue={note.content}
          placeholder="Start writing…"
          rows={18}
          maxLength={100000}
          aria-label="Note content"
          className="w-full resize-y rounded-lg border border-neutral-200 bg-white px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-neutral-700"
        />

        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
