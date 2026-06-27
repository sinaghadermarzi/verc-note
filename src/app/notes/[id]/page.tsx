import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NoteEditor } from "@/components/NoteEditor";

export const dynamic = "force-dynamic";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  // Scope the lookup by userId: a note belonging to someone else simply 404s,
  // so note ids are not enumerable across accounts.
  const note = await prisma.note.findFirst({
    where: { id, userId },
    select: { id: true, title: true, content: true },
  });

  if (!note) notFound();

  return <NoteEditor note={note} />;
}
