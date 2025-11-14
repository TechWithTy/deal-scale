"use client";

import { Lens } from "@/components/magicui/lens";
import { useTheme } from "@/contexts/theme-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { ProductType } from "@/types/products";
import { v4 as uuid } from "uuid";

interface ImageGalleryProps {
	images: ReadonlyArray<string>;
	productTitle: string;
}

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
	const [selectedImage, setSelectedImage] = useState(0);
	const isMobile = useIsMobile();
	const { resolvedTheme } = useTheme();

	// Theme-aware carousel button classes
	const carouselBtnClass =
		resolvedTheme === "dark"
			? "bg-gray-900 text-white hover:bg-gray-800 border-gray-700"
			: "bg-white text-gray-900 hover:bg-gray-100 border-gray-200";

	if (isMobile) {
		return (
			<div className="w-full">
				{/* Main carousel */}
				<Carousel className="mb-4 w-full">
					<CarouselContent>
						{images.map((image) => (
							<CarouselItem key={uuid()}>
								<div className="aspect-square w-full">
									{/* * Use Next.js Image for optimized images if possible */}
									{/* ! If images are external or dynamic, fallback to <img> */}
									{/* todo: Replace with next/image if images are local/static */}
									<img
										src={image}
										alt={productTitle}
										className="h-full w-full rounded-lg object-cover object-center"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className={`left-2 ${carouselBtnClass}`} />
					<CarouselNext className={`right-2 ${carouselBtnClass}`} />
				</Carousel>

				{/* Preview thumbnails */}
				<div className="flex gap-2 overflow-x-auto pb-2">
					{images.map((image, index) => (
						<button
							key={uuid()}
							type="button"
							className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md ${
								index === selectedImage
									? "ring-2 ring-indigo-500"
									: "ring-1 ring-gray-200"
							}`}
							onClick={() => setSelectedImage(index)}
						>
							{/* * Use Next.js Image for optimized thumbnails if possible */}
							{/* todo: Replace with next/image if images are local/static */}
							<img
								src={image}
								alt={`${productTitle} thumbnail`}
								className="h-full w-full object-cover object-center"
							/>
						</button>
					))}
				</div>
			</div>
		);
	}

	// Desktop grid layout (existing code)
	return (
		<div className="flex flex-col-reverse">
			{/* Image selector */}
			<div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
				<div className="grid grid-cols-4 gap-6">
					{images.map((image, index) => (
						<button
							key={uuid()}
							type="button"
							className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white font-medium text-gray-900 text-sm uppercase hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${
								index === selectedImage
									? "ring-2 ring-indigo-500"
									: "ring-1 ring-gray-200"
							}`}
							onClick={() => setSelectedImage(index)}
						>
							<span className="sr-only">
								{productTitle} {index + 1}
							</span>
							<span className="absolute inset-0 overflow-hidden rounded-md">
								<img
									src={image}
									alt={productTitle}
									className="h-full w-full object-cover object-center"
								/>
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Selected image with MagicUI Lens */}
			<div className="aspect-h-1 aspect-w-1 w-full">
				<Lens zoomFactor={1.4} lensSize={180}>
					<img
						src={images[selectedImage]}
						alt="Product"
						className="h-full w-full object-cover object-center sm:rounded-lg"
					/>
				</Lens>
			</div>
		</div>
	);
};

export default ImageGallery;
