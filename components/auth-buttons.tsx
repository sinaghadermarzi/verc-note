import { signIn, signOut } from "@/auth";

export function GoogleSignInButton({ callbackUrl = "/notes" }: { callbackUrl?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: callbackUrl });
      }}
    >
      <button className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 shadow hover:bg-slate-200" type="submit">
        Continue with Google
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800" type="submit">
        Sign out
      </button>
    </form>
  );
}
