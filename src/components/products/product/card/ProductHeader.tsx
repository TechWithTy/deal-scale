import Link from "next/link";
import { ProductCategory } from "@/types/products";
import type { ProductHeaderProps } from "./types";

const ProductHeader = ({
	id,
	slug,
	name,
	salesIncentive,
	categories,
}: ProductHeaderProps) => {
	const productPath = slug ?? id;
	// Redirect Remote Closers products to application page
	const isRemoteCloser =
		categories?.includes(ProductCategory.RemoteClosers) ?? false;
	const href = isRemoteCloser ? "/closers/apply" : `/products/${productPath}`;

	return (
		<div className="relative text-center">
			{salesIncentive?.discountPercent !== undefined && (
				<div className="-top-2 -translate-x-1/2 absolute left-1/2 z-10 transform">
					<span className="rounded bg-blue-100 px-2 py-0.5 font-semibold text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-200">
						{salesIncentive.discountPercent}% OFF
					</span>
				</div>
			)}
			<Link
				href={href}
				className="mt-2 line-clamp-2 font-semibold text-base text-gray-900 leading-tight transition-colors duration-200 hover:text-blue-600 sm:text-lg sm:leading-snug md:text-xl md:leading-normal dark:text-gray-100 dark:hover:text-blue-400"
				title={name}
			>
				{name}
			</Link>
		</div>
	);
};

export default ProductHeader;
