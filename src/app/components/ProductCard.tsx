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
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
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
            import Image from "next/image";
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGEKIT_BASE_URL}${product.imageUrl}?tr=q-80,w-${IMAGE_VARIANTS.SQUARE.dimensions.width},h-${IMAGE_VARIANTS.SQUARE.dimensions.height},cm-extract,fo-center`}
              alt={product.name}
              width={IMAGE_VARIANTS.SQUARE.dimensions.width}
              height={IMAGE_VARIANTS.SQUARE.dimensions.height}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/products/${product._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{product.name}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="card-actions justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold">
              From ${lowestPrice.toFixed(2)}
            </span>
            <span className="text-xs text-base-content/50">
              {product.variants.length} sizes available
            </span>
          </div>

          <Link
            href={`/products/${product._id}`}
            className="btn btn-primary btn-sm gap-2"
          >
            <Eye className="w-4 h-4" />
            View Options
          </Link>
        </div>
      </div>
    </div>
  );
}
