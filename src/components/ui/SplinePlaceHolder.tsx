import React from "react";

export default function SplinePlaceHolder() {
	return (
		<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
			<div className="relative h-full max-h-full w-full max-w-full overflow-hidden">
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 aspect-square w-56 animate-pulse rounded-full bg-gradient-to-r from-primary/50 to-focus/50 sm:w-64" />
				<div
					className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 aspect-square w-40 animate-float rounded-full bg-gradient-to-r from-focus/30 to-primary/30 sm:w-48"
					style={{ animationDelay: "0.3s" }}
				/>
				<div
					className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 aspect-square w-28 animate-float rounded-full bg-gradient-to-r from-primary/60 to-focus/60 sm:w-32"
					style={{ animationDelay: "0.7s" }}
				/>
				<div
					className="absolute top-1/4 left-1/4 aspect-square w-12 rotate-45 animate-float bg-tertiary/40 sm:w-16"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="absolute right-1/4 bottom-1/4 aspect-square w-16 rotate-12 animate-float border-2 border-primary/50 sm:w-20"
					style={{ animationDelay: "1.5s" }}
				/>
				<div
					className="absolute top-1/3 right-1/3 h-16 w-10 rotate-45 animate-float rounded-full bg-focus/30 sm:h-24 sm:w-12"
					style={{ animationDelay: "0.5s" }}
				/>
				<div
					className="absolute bottom-1/3 left-1/3 aspect-square w-8 animate-spin-slow rounded-sm border border-accent/30 sm:w-10"
					style={{ animationDelay: "0.8s" }}
				/>
				<div
					className="absolute top-2/3 right-1/6 aspect-square w-6 animate-ping rounded-full bg-primary/20 sm:w-8"
					style={{ animationDuration: "3s" }}
				/>
				<div
					className="absolute bottom-1/6 left-2/3 h-8 w-4 animate-float rounded-full bg-gradient-to-t from-focus/20 to-transparent sm:h-12 sm:w-6"
					style={{ animationDelay: "1.2s" }}
				/>
			</div>
			<div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-30" />
			{/* Removed the following two divs to prevent overflow outside the container */}
			{/* <div className="absolute -top-20 -right-20 w-40 sm:w-60 aspect-square bg-primary/30 rounded-full blur-xl"></div> */}
			{/* <div className="absolute -bottom-20 -left-20 w-40 sm:w-60 aspect-square bg-focus/30 rounded-full blur-xl"></div> */}
			<div className="absolute top-1/4 left-1/4 aspect-square w-32 rounded-full bg-tertiary/20 blur-lg sm:w-40" />
			<div className="absolute right-1/4 bottom-1/4 aspect-square w-32 overflow-hidden rounded-full bg-relative shadow-lg shadow-primary/20 blur-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-focus/10 before:opacity-50/20 sm:w-40" />
		</div>
	);
}
