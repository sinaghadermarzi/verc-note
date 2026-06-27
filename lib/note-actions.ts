"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

function cleanText(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export async function listNotesForCurrentUser() {
  const userId = await requireUserId();

  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createNote(formData: FormData) {
  const userId = await requireUserId();
  const title = cleanText(formData.get("title"));
  const content = cleanText(formData.get("content"));

  if (!title) {
    throw new Error("A title is required.");
  }

  await prisma.note.create({
    data: { title, content, userId }
  });

  revalidatePath("/notes");
}

export async function updateNote(formData: FormData) {
  const userId = await requireUserId();
  const id = cleanText(formData.get("id"));
  const title = cleanText(formData.get("title"));
  const content = cleanText(formData.get("content"));

  if (!id || !title) {
    throw new Error("A note id and title are required.");
  }

  await prisma.note.update({
    where: { id_userId: { id, userId } },
    data: { title, content }
  });

  revalidatePath("/notes");
}

export async function deleteNote(formData: FormData) {
  const userId = await requireUserId();
  const id = cleanText(formData.get("id"));

  if (!id) {
    throw new Error("A note id is required.");
  }

  await prisma.note.delete({
    where: { id_userId: { id, userId } }
  });

  revalidatePath("/notes");
}
