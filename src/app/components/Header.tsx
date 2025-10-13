"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/60 bg-black/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold"
            prefetch={true}
            onClick={() => showNotification("Welcome to ImageKit Shop", "info")}
          >
            <Home className="w-5 h-5" />
            <span>ImageKit Shop</span>
          </Link>

          <div className="relative">
            <details className="group">
              <summary className="list-none cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 transition">
                <User className="w-5 h-5" />
              </summary>
              <div className="absolute right-0 mt-2 w-64 rounded-md bg-neutral-900 border border-white/10 shadow-xl p-2">
                {session ? (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-sm opacity-70">
                      {session.user?.email?.split("@")[0]}
                    </div>
                    <div className="h-px bg-white/10 my-1" />
                    {session.user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block w-full px-3 py-2 rounded hover:bg-white/10"
                        onClick={() =>
                          showNotification("Welcome to Admin Dashboard", "info")
                        }
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link href="/orders" className="block w-full px-3 py-2 rounded hover:bg-white/10">
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded hover:bg-white/10 text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full px-3 py-2 rounded hover:bg-white/10"
                    onClick={() => showNotification("Please sign in to continue", "info")}
                  >
                    Login
                  </Link>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}