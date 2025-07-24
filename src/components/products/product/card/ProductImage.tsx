import Link from "next/link";
import type { ProductImageProps } from "./types";

const ProductImage = ({ imageUrl, alt, slug }: ProductImageProps) => (
  <div className="w-full pt-2">
    <Link
      href={slug ? `/products/${slug}` : "#"}
      tabIndex={0}
      aria-label={`View details for ${alt}`}
      className="mb-4 block h-40 w-full rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800"
    >
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        className="h-full w-full rounded-xl object-cover"
        draggable={false}
      />
    </Link>
  </div>
);

export default ProductImage;
