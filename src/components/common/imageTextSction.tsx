"use client";
import Image from "next/image";
import type { FC, ReactNode } from "react";

// * Props for FloatingImageSection component
type FloatingImageSectionProps = {
	image: { src: string; alt?: string };
	title: string;
	content: ReactNode;
	index?: number | string;
	imageOnLeft?: boolean;
};

/**
 * FloatingImageSection - A section with a floating image and text, responsive and accessible.
 * @param props FloatingImageSectionProps
 */
const FloatingImageSection: FC<FloatingImageSectionProps> = ({
	image,
	title,
	content,
	index,
	imageOnLeft = true,
}) => {
	return (
		<div
			className={`my-4 flex w-full flex-col gap-5 p-2 ${
				imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
			}`}
		>
			{/* Image Section */}
			<div className="flex flex-1 items-center justify-center gap-3 lg:w-1/3">
				<div className="animate-float">
					<Image
						className="rounded-lg"
						src={image.src}
						alt={image.alt ?? `${index ?? ""}-section`}
						height={500}
						width={500}
						priority={index === 0}
					/>
				</div>
			</div>
			{/* Text Section */}
			<div className="flex flex-col justify-center lg:w-2/3">
				<div className="font-bold text-3xl">{title}</div>
				<div>{content}</div>
			</div>
		</div>
	);
};

export default FloatingImageSection;
