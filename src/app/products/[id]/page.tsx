"use client";

import { Image, type Transformation } from "@imagekit/next";
import {
  IProduct,
  ImageVariant,
  IMAGE_VARIANTS,
  ImageVariantType,
} from "../../../../models/product.model";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Check, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
 

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(
    null
  );
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      const id = params?.id;

      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/products/${id.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handlePurchase = async (variant: ImageVariant) => {
    if (!session) {
      toast.error("Please login to make a purchase");
      router.push("/login");
      return;
    }

    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    try {
      const orderRes = await fetch(`/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, variant }),
      });
      if (!orderRes.ok) throw new Error(await orderRes.text());
      const { orderId, amount } = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "USD",
        name: "ImageKit Shop",
        description: `${product.name} - ${variant.type} Version`,
        order_id: orderId,
        handler: function () {
          toast.success("Payment successful!");
          router.push("/orders");
        },
        prefill: {
          email: session.user.email,
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Payment failed"
      );
    }
  };

  const getTransformation = (variantType: ImageVariantType): Transformation[] => {
    const variant = IMAGE_VARIANTS[variantType];
    return [
      {
        width: variant.dimensions.width.toString(),
        height: variant.dimensions.height.toString(),
        cropMode: "extract",
        focus: "center",
        quality: 60,
      } satisfies Transformation,
    ];
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );

  if (error || !product)
    return (
      <div className="max-w-md mx-auto my-8 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <span>{error || "Product not found"}</span>
      </div>
    );

  return (
    <div className="px-10 sm:px-2 md:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div
            className="relative rounded-lg overflow-hidden"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="eager"
              priority
              width={(selectedVariant
                ? IMAGE_VARIANTS[selectedVariant.type].dimensions.width
                : IMAGE_VARIANTS.SQUARE.dimensions.width).valueOf()}
              height={(selectedVariant
                ? IMAGE_VARIANTS[selectedVariant.type].dimensions.height
                : IMAGE_VARIANTS.SQUARE.dimensions.height).valueOf()}
              transformation={selectedVariant
                ? getTransformation(selectedVariant.type)
                : getTransformation("SQUARE")}
            />
          </div>

          {selectedVariant && (
            <div className="text-sm text-center text-neutral-400">
              Preview: {IMAGE_VARIANTS[selectedVariant.type].dimensions.width} x{" "}
              {IMAGE_VARIANTS[selectedVariant.type].dimensions.height}px
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-base-content/80 text-lg">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Versions</h2>
            {product.variants.map((variant, index) => (
              <div
                key={`${variant.type}-${index}`}
                className={`rounded-lg border cursor-pointer transition-colors bg-neutral-900 border-white/10 hover:bg-neutral-800 ${
                  selectedVariant?.type === variant.type
                    ? "ring-2 ring-white/30"
                    : ""
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">
                          {
                            IMAGE_VARIANTS[
                              variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                            ].label
                          }
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {
                            IMAGE_VARIANTS[
                              variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                            ].dimensions.width
                          }{" "}
                          x{" "}
                          {
                            IMAGE_VARIANTS[
                              variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                            ].dimensions.height
                          }
                          px • {variant.license} license
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">
                        ${variant.price.toFixed(2)}
                      </span>
                      <button
                        className="inline-flex items-center rounded-md bg-white text-black px-3 py-1.5 text-sm font-medium hover:bg-neutral-200 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(variant);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-white/10 bg-neutral-900">
            <div className="p-4">
              <h3 className="font-semibold mb-2">License Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Personal: Use in personal projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Commercial: Use in commercial projects</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
