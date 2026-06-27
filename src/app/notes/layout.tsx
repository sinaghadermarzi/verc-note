import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppHeader } from "@/components/AppHeader";

// Guard for the entire /notes section. Any unauthenticated request is bounced
// to /login before a child page renders.
export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <AppHeader
        userName={session.user.name}
        userEmail={session.user.email}
      />
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
