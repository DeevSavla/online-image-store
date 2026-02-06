"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "./components/ImageGallery";
import { IProduct } from "../../models/product.model";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setProducts(Array.isArray(json?.products) ? json.products : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#E5E7EB] bg-[#F5F7FA] px-6 py-8 sm:px-10 sm:py-10">
        <div className="max-w-3xl space-y-4">
          <p className="inline-flex items-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-medium tracking-wide text-[#2563EB]">
            Curated image store
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Discover premium images,{" "}
            <span className="text-[#2563EB]">ready for your next project</span>.
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
            Browse a curated collection of high‑quality visuals, optimized for
            fast delivery and simple licensing. Choose a size, complete checkout
            with Razorpay, and download instantly from your orders.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-[#111827]">
            All images
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            {products.length > 0
              ? `${products.length} item${products.length > 1 ? "s" : ""} available`
              : "New images are added regularly"}
          </p>
        </div>
        <ImageGallery products={products} />
      </section>
    </div>
  );
}