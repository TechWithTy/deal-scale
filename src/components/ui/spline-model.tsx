import { useTheme } from "@/contexts/theme-context"; // * Theme context for dark/light mode
import { useIsMobile } from "@/hooks/use-mobile";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Spline from "@splinetool/react-spline";
import React, { useRef, useState, useEffect } from "react";
import SplinePlaceHolder from "./SplinePlaceHolder";

type SplineApp = {
	setZoom: (zoom: number) => void;
	findObjectByName: (name: string) => SPEObject | null;
	findObjectById: (id: string) => SPEObject | null;
	emitEvent: (event: string, idOrName: string) => void;
};

type SPEObject = {
	name: string;
	id?: string;
	position: {
		x: number;
		y: number;
		z: number;
	};
	emitEvent: (event: string) => void;
};

type SplineEvent = {
	target: {
		name: string;
	};
};

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

	const splineRef = useRef<SplineApp | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	function onLoad(spline: SplineApp) {
		try {
			splineRef.current = spline;
			setIsLoading(false);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to load Spline scene"),
			);
		}
	}

	function onMouseHover(e: SplineEvent) {
		try {
			if (e.target.name === hoverObjectName) {
				const obj = splineRef.current?.findObjectByName(e.target.name);
				if (obj) {
					obj.emitEvent("mouseHover");
				}
			}
		} catch (err) {
			console.error("Error handling hover:", err);
		}
	}

	if (error) {
		return (
			<div className="flex h-full w-full items-center justify-center rounded-lg bg-red-50 p-4 text-red-600">
				Failed to load 3D model: {error.message}
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="relative aspect-square h-full max-h-full w-full max-w-full overflow-hidden sm:h-[350px] md:h-[450px] lg:h-[600px] 2xl:h-[700px]"
		>
			{isLoading && <SplinePlaceHolder />}
			{/* ! Spline scene switches based on theme, unless sceneUrl prop is a custom value */}
			<Spline
				scene={effectiveSceneUrl}
				onLoad={onLoad}
				onSplineMouseHover={onMouseHover}
			/>
		</div>
	);
}
