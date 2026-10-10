"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    setSending(false);
    if (!response.ok) {
      setError("Those details do not match the planner desk.");
      return;
    }
    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid w-full max-w-md gap-4 rounded-[1.8rem] bg-paper p-8 shadow-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Serendrift</p>
      <h1 className="serif text-4xl">Planner desk</h1>
      <p className="text-sm text-mist">
          Sign in to change tours, images, and guest requests. First password is Serendrift@2026 — change it in .env.local
          before you go live.
        </p>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input className="field" name="email" type="email" required defaultValue="admin@serendrift.lk" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input className="field" name="password" type="password" required />
      </label>
      {error ? <p className="text-sm text-coral">{error}</p> : null}
      <button className="btn btn-lagoon" disabled={sending}>
        {sending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-deep px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
