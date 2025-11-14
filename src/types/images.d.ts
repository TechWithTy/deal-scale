// ! Image file module declarations
// * Provides proper typings for importing image assets in TypeScript / Next.js
// * Uses `StaticImageData` so images work seamlessly with `next/image`

declare module "*.png" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.jpg" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.jpeg" {
	const value: import("next/image").StaticImageData;
	export default value;
}

declare module "*.gif" {
	const value: import("next/image").StaticImageData;
	export default value;
}
