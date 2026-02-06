"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login successful!");
      router.push("/");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <div className="w-full rounded-3xl border border-[#E5E7EB] bg-[#F5F7FA] px-6 py-7 shadow-lg shadow-black/5">
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Sign in to access your orders and manage purchases.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-wide text-[#6B7280]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] outline-none ring-[#2563EB]/30 placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-wide text-[#6B7280]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] outline-none ring-[#2563EB]/30 placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#2563EB] hover:text-[#1D4ED8]"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}