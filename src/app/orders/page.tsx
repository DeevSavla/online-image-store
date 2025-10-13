"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IOrder } from "../../../models/order.model";
import { Loader2, Download } from "lucide-react";
import { Image } from "@imagekit/next";
import { IMAGE_VARIANTS } from "../../../models/product.model";

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
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

    if (session) fetchOrders();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
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
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Preview Image - Low Quality */}
                  <div
                    className="relative rounded-lg overflow-hidden bg-base-200"
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
                          className="w-full h-full object-cover"
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

                  {/* Order Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold mb-2">
                          Order #{order._id?.toString().slice(-6)}
                        </h2>
                        <div className="space-y-1 text-base-content/70">
                          <p>
                            Resolution: {variantDimensions.width} x{" "}
                            {variantDimensions.height}px
                          </p>
                          <p>
                            License Type:{" "}
                            <span className="capitalize">
                              {order.variant.license}
                            </span>
                          </p>
                          <p>
                            Status:{" "}
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "completed"
                                  ? "bg-success/20 text-success"
                                  : order.status === "failed"
                                  ? "bg-error/20 text-error"
                                  : "bg-warning/20 text-warning"
                              }`}
                            >
                              {order.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold mb-4">
                          ${order.amount.toFixed(2)}
                        </p>
                        {order.status === "completed" && (
                          <a
                            href={`${product?.imageUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary gap-2"
                            download={`image-${order._id
                              ?.toString()
                              .slice(-6)}.jpg`}
                          >
                            <Download className="w-4 h-4" />
                            Download High Quality
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-base-content/70 text-lg">No orders found</div>
          </div>
        )}
      </div>
    </div>
  );
}
