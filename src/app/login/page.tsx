"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md w-full md3-card shadow-xl space-y-8 bg-surface">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">PPanel Login</h1>
          <p className="mt-2 text-on-surface-variant">Welcome back to your monitor</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 px-4">Email</label>
              <input
                type="email"
                required
                className="md3-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 px-4">Password</label>
              <input
                type="password"
                required
                className="md3-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="w-full md3-button-primary">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
