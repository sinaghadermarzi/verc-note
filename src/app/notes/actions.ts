"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";

const MAX_TITLE = 200;
const MAX_CONTENT = 100_000;

// Resolve the current user id or bail out. Every mutation must call this so a
// request can never act on data it isn't authenticated for.
async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");
  return userId;
}

export async function createNote(): Promise<void> {
  const userId = await requireUserId();
  const note = await prisma.note.create({
    data: { userId, title: "Untitled", content: "" },
    select: { id: true },
  });
  await recordAudit({ action: "note.create", userId, targetId: note.id });
  revalidatePath("/notes");
  redirect(`/notes/${note.id}`);
}

export async function updateNote(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").slice(0, MAX_TITLE);
  const content = String(formData.get("content") ?? "").slice(0, MAX_CONTENT);
  if (!id) return;

  // Scope the update by both id AND userId so users can only edit their own
  // notes. updateMany returns count 0 (instead of throwing) on a miss.
  const result = await prisma.note.updateMany({
    where: { id, userId },
    data: { title: title.trim() || "Untitled", content },
  });
  if (result.count === 0) return;

  await recordAudit({ action: "note.update", userId, targetId: id });
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
}

export async function deleteNote(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Ownership enforced via the userId in the where clause.
  const result = await prisma.note.deleteMany({ where: { id, userId } });
  if (result.count > 0) {
    await recordAudit({ action: "note.delete", userId, targetId: id });
  }

  revalidatePath("/notes");
  redirect("/notes");
}
