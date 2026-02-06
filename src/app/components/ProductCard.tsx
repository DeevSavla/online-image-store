import { Image } from "@imagekit/next";
import Link from "next/link";
import { IProduct, IMAGE_VARIANTS } from "../../../models/product.model";
import { Eye } from "lucide-react";

export default function ProductCard({ product }: { product: IProduct }) {
  const lowestPrice = product.variants.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants[0]?.price || 0
  );

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] hover:border-[#2563EB]/40 transition-all duration-300">
      <div className="relative px-4 pt-4">
        <Link
          href={`/products/${product._id}`}
          className="relative group w-full"
        >
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{
              aspectRatio:
                IMAGE_VARIANTS.SQUARE.dimensions.width /
                IMAGE_VARIANTS.SQUARE.dimensions.height,
            }}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={IMAGE_VARIANTS.SQUARE.dimensions.width}
              height={IMAGE_VARIANTS.SQUARE.dimensions.height}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
              transformation={[{
                width: IMAGE_VARIANTS.SQUARE.dimensions.width.toString(),
                height: IMAGE_VARIANTS.SQUARE.dimensions.height.toString(),
                cropMode: "extract",
                focus: "center",
                quality: 80,
              }]}
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
        </Link>
      </div>

      <div className="p-4">
        <Link
          href={`/products/${product._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="text-lg font-semibold text-[#111827]">
            {product.name}
          </h2>
        </Link>

        <p className="text-sm text-[#6B7280] line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#111827]">
              From ${lowestPrice.toFixed(2)}
            </span>
            <span className="text-xs text-[#6B7280]">
              {product.variants.length} sizes available
            </span>
          </div>

          <Link
            href={`/products/${product._id}`}
            className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] text-white px-3 py-1.5 text-sm font-medium hover:bg-[#1D4ED8] transition"
          >
            <Eye className="w-4 h-4" />
            View Options
          </Link>
        </div>
      </div>
    </div>
  );
}
