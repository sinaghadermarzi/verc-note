import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/auth-buttons";

export default async function LoginPage({ searchParams }: { searchParams?: { callbackUrl?: string } }) {
  const session = await auth();
  const callbackUrl = searchParams?.callbackUrl || "/notes";

  if (session) {
    redirect(callbackUrl);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="mt-3 text-slate-300">Use a verified Google account to access your private notes.</p>
        <div className="mt-8">
          <GoogleSignInButton callbackUrl={callbackUrl} />
        </div>
      </div>
    </main>
  );
}
