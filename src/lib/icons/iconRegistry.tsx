// src/lib/icons/iconRegistry.ts
import type { FC, SVGProps } from "react";
import FallbackIcon from "./Fallbackicon";

type IconComponent = FC<SVGProps<SVGSVGElement>>;

export const ICON_REGISTRY: Record<string, IconComponent> = {
	amazon: FallbackIcon,
	google: FallbackIcon,
	// ...
};
