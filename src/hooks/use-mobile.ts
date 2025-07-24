import { useEffect, useState } from "react";

export const useIsMobile = (breakpoint = 768) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const checkIfMobile = () => {
				setIsMobile(window.innerWidth < breakpoint);
			};

			// Initial check
			checkIfMobile();

			// Add event listener using throttle for better performance
			let resizeTimer: ReturnType<typeof setTimeout>;
			const handleResize = () => {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(checkIfMobile, 100);
			};

			window.addEventListener("resize", handleResize);

			// Cleanup
			return () => {
				clearTimeout(resizeTimer);
				window.removeEventListener("resize", handleResize);
			};
		}
	}, [breakpoint]);

	// During SSR, assume not mobile to match initial render
	if (typeof window === "undefined") return false;

	return isMobile;
};
