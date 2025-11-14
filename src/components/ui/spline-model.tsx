"use client";
import { useTheme } from "@/contexts/theme-context"; // * Theme context for dark/light mode
import SplinePlaceHolder from "./SplinePlaceHolder";

/**
 * SplineModel renders a Spline 3D scene. All interaction (zoom, pan, orbit) should be configured in the Spline editor Play settings.
 * This component does not control zoom or camera.
 */
/**
 * SplineModel renders a Spline 3D scene with theme-based scene switching.
 * - Uses useTheme() to detect dark/light mode.
 * - Renders different Spline scenes for each mode.
 * - All interaction (zoom, pan, orbit) should be configured in the Spline editor Play settings.
 * - This component does not control zoom or camera.
 */
export default function SplineModel({
	sceneUrl = "https://prod.spline.design/homQGDx44sO4Aflh/scene.splinecode", // fallback default
	hoverObjectName = "InteractiveObject",
}: {
	sceneUrl?: string;
	hoverObjectName?: string;
}) {
	// * Define Spline scene URLs for both themes
	const LIGHT_SCENE_URL =
		"https://prod.spline.design/kWPPupVMJyifM1EC/scene.splinecode"; // todo: replace with your light scene
	const DARK_SCENE_URL =
		"https://prod.spline.design/homQGDx44sO4Aflh/scene.splinecode"; // todo: replace with your dark scene

	// * Get current theme
	const { resolvedTheme } = useTheme();
	// * Pick the correct scene URL based on theme
	const selectedSceneUrl =
		resolvedTheme === "dark" ? DARK_SCENE_URL : LIGHT_SCENE_URL;
	// * Allow explicit override via prop
	const effectiveSceneUrl =
		sceneUrl !== LIGHT_SCENE_URL && sceneUrl !== DARK_SCENE_URL
			? sceneUrl
			: selectedSceneUrl;

	return (
		<div className="relative aspect-square h-full max-h-full w-full max-w-full overflow-hidden sm:h-[350px] md:h-[450px] lg:h-[600px] 2xl:h-[700px]">
			<SplinePlaceHolder />
			{/* Placeholder shown while Spline integration is disabled.
				When re-enabling Spline, replace this with the actual component and
				restore the dynamic import logic. */}
			<span className="sr-only">
				Spline scene {effectiveSceneUrl} (hover target: {hoverObjectName})
			</span>
		</div>
	);
}
