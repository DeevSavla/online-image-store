"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Home, User, ShoppingBag,Search } from "lucide-react";
import toast from "react-hot-toast";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-[#FFFFFF]/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
            prefetch={true}
            onClick={() => toast("Welcome to ImageKit Shop", { icon: "ℹ️" })}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB]/10 ring-1 ring-[#2563EB]/40">
              <Home className="w-5 h-5 text-[#2563EB]" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[#111827]">ImageKit Shop</span>
              <span className="text-xs font-normal text-[#6B7280]">
                Premium, ready‑to‑use imagery
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="hidden sm:inline-flex text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
              aria-label="Search products"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            {
              session?.user && (
                <Link
                  href="/orders"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F5F7FA] px-3 py-1.5 text-xs font-medium text-[#111827] hover:bg-white transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  My Orders
                </Link>
              )
            }

            <div className="relative">
              <details className="group">
                <summary className="list-none cursor-pointer bg-white inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-700/80">
                  <User className="w-5 h-5 text-[#111827]" />
                </summary>
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-2xl p-2">
                  {session ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 text-xs uppercase tracking-wide text-[#6B7280]">
                        Signed in as
                      </div>
                      <div className="px-3 pb-2 text-sm font-medium text-[#111827]">
                        {session.user?.email}
                      </div>
                      <div className="h-px bg-[#E5E7EB] my-1" />
                      {session.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block w-full rounded-lg px-3 py-2 text-sm text-[#111827] hover:bg-[#F5F7FA]"
                          onClick={() =>
                            toast("Welcome to Admin Dashboard", { icon: "ℹ️" })
                          }
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        className="block w-full rounded-lg px-3 py-2 text-sm text-[#111827] hover:bg-[#F5F7FA]"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#B91C1C] hover:bg-[#FEE2E2]"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-xs uppercase tracking-wide text-[#6B7280]">
                        Account
                      </div>
                      <Link
                        href="/login"
                        className="block w-full rounded-lg bg-[#2563EB] text-center text-sm font-medium text-white px-3 py-2 hover:bg-[#1D4ED8] transition-colors"
                        onClick={() =>
                          toast("Please sign in to continue", { icon: "ℹ️" })
                        }
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full rounded-lg px-3 py-2 text-center text-sm text-[#111827] hover:bg-[#F5F7FA] transition-colors"
                      >
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}