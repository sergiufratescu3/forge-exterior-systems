"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        const destination = searchParams.get("from") || "/admin";
        router.push(destination);
        router.refresh();
      } else {
        setError(json.message || "Invalid email or password.");
      }
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ink mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-concrete bg-white px-4 py-3 text-ink focus:outline-none focus:border-ink"
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-ink mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-concrete bg-white px-4 py-3 text-ink focus:outline-none focus:border-ink"
          autoComplete="current-password"
        />
      </div>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? "SIGNING IN…" : "SIGN IN"}
      </Button>
    </form>
  );
}
