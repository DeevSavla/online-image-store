"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IOrder } from "../../../models/order.model";
import { Loader2, Download } from "lucide-react";
import { Image } from "@imagekit/next";
import { IMAGE_VARIANTS } from "../../../models/product.model";

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/user", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        console.log(data);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Access your purchased images and download them in high quality.
          </p>
        </div>
        <span className="hidden text-xs sm:inline-flex rounded-full border border-[#E5E7EB] bg-[#F5F7FA] px-3 py-1 font-medium text-[#6B7280]">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="space-y-4">
        {orders.map((order) => {
          const variantDimensions =
            IMAGE_VARIANTS[
              order.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
            ].dimensions;

          const product =
            typeof order.productId === "object" && "imageUrl" in order.productId
              ? order.productId
              : null;

          return (
            <div
              key={order._id?.toString()}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F5F7FA] px-4 py-4 sm:px-6 sm:py-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row">
                <div
                  className="relative overflow-hidden rounded-xl bg-[#FFFFFF] ring-1 ring-[#E5E7EB]"
                  style={{
                    width: "200px",
                    aspectRatio: `${variantDimensions.width} / ${variantDimensions.height}`,
                  }}
                >
                  {typeof order.productId === "object" &&
                    "imageUrl" in order.productId && (
                      <Image
                        src={order.productId.imageUrl}
                        alt={`Order ${order._id?.toString().slice(-6)}`}
                        width={variantDimensions.width}
                        height={variantDimensions.height}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        transformation={[
                          {
                            width: variantDimensions.width.toString(),
                            height: variantDimensions.height.toString(),
                            cropMode: "extract",
                            focus: "center",
                            quality: 60,
                          },
                        ]}
                      />
                    )}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-[#111827]">
                        Order #{order._id?.toString().slice(-6)}
                      </h2>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#6B7280]">
                        <span>
                          Resolution {variantDimensions.width} ×{" "}
                          {variantDimensions.height}px
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-600" />
                        <span className="capitalize">
                          {order.variant.license} license
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span className="text-sm font-semibold text-[#111827]">
                        ${order.amount.toFixed(2)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                            : order.status === "failed"
                            ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                            : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {order.status === "completed" && (
                    <div className="mt-4">
                      <a
                        href={`${product?.imageUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
                        download={`image-${order._id
                          ?.toString()
                          .slice(-6)}.jpg`}
                      >
                        <Download className="w-4 h-4" />
                        Download high‑quality image
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F5F7FA] py-12 text-center">
            <div className="text-sm sm:text-base text-[#6B7280]">
              You don&apos;t have any orders yet.
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#6B7280]">
              Browse the gallery, choose a size, and your purchases will appear
              here for instant download.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
