import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth-buttons";
import { createNote, deleteNote, listNotesForCurrentUser, updateNote } from "@/lib/note-actions";

export default async function NotesPage() {
  const session = await auth();
  const notes = await listNotesForCurrentUser();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <header className="mb-10 flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Signed in as {session?.user?.email}</p>
          <h1 className="mt-1 text-4xl font-bold">Your notes</h1>
        </div>
        <SignOutButton />
      </header>

      <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Create a note</h2>
        <form action={createNote} className="mt-4 grid gap-4">
          <input className="rounded-lg border border-slate-300 px-3 py-2" maxLength={120} name="title" placeholder="Title" required />
          <textarea className="min-h-32 rounded-lg border border-slate-300 px-3 py-2" name="content" placeholder="Write something private..." />
          <button className="w-fit rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300" type="submit">
            Save note
          </button>
        </form>
      </section>

      <section className="grid gap-5">
        {notes.length === 0 ? <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">No notes yet. Create your first note above.</p> : null}
        {notes.map((note) => (
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6" key={note.id}>
            <form action={updateNote} className="grid gap-3">
              <input name="id" type="hidden" value={note.id} />
              <input className="rounded-lg border border-slate-300 px-3 py-2 font-semibold" maxLength={120} name="title" required defaultValue={note.title} />
              <textarea className="min-h-40 rounded-lg border border-slate-300 px-3 py-2" name="content" defaultValue={note.content} />
              <p className="text-xs text-slate-500">Updated {note.updatedAt.toLocaleString()}</p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg bg-sky-400 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-300" type="submit">
                  Update
                </button>
              </div>
            </form>
            <form action={deleteNote} className="mt-3">
              <input name="id" type="hidden" value={note.id} />
              <button className="rounded-lg border border-red-400/40 px-4 py-2 font-semibold text-red-200 hover:bg-red-950" type="submit">
                Delete
              </button>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
