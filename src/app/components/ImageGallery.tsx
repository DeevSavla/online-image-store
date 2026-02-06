import { IProduct } from "../../../models/product.model";
import ProductCard from "./ProductCard";

interface ImageGalleryProps {
  products: IProduct[];
}

export default function ImageGallery({ products }: ImageGalleryProps) {
  const list = Array.isArray(products) ? products : [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {list.map((product) => (
        <ProductCard key={product._id?.toString()} product={product} />
      ))}

      {list.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-[#6B7280]">No products found</p>
        </div>
      )}
    </div>
  );
}