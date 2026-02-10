"use client";

import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ImageGallery from "../components/ImageGallery";
import { IProduct } from "../../../models/product.model";
import { Search as SearchIcon } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(q);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const runSearch = useCallback(async (term: string) => {
    setLoading(true);
    try {
      const url = term.trim()
        ? `/api/products?search=${encodeURIComponent(term.trim())}`
        : "/api/products";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setProducts(Array.isArray(json?.products) ? json.products : []);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync input from URL when q changes (e.g. back button or initial load)
  useEffect(() => {
    setQuery(q);
  }, [q]);

  // Initial fetch on mount so all products show right away
  useEffect(() => {
    runSearch(q);
  }, [runSearch]); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount with initial q

  // Debounced search as user types (skip first run to avoid double fetch with initial effect)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      runSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    const url = term ? `/search?q=${encodeURIComponent(term)}` : "/search";
    window.history.replaceState(null, "", url);
    runSearch(term);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#E5E7EB] bg-[#F5F7FA] px-6 py-8 sm:px-10 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111827] mb-4">
          Search products
        </h1>
        <p className="text-sm text-[#6B7280] mb-6 max-w-xl">
          Enter a letter or word to see products whose names start with that
          text.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]"
              aria-hidden
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. A or Sun"
              className="w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
              aria-label="Search products by name"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-[#111827]">
            {query.trim()
              ? `Results for “${query.trim()}”`
              : "All products"}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            {loading
              ? "Searching…"
              : `${products.length} product${products.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#6B7280]">Loading…</div>
        ) : (
          <ImageGallery products={products} />
        )}
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-[#6B7280]">Loading search…</div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
