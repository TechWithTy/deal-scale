import { useEffect, useState } from "react";

/**
 * useHasMounted
 * Returns true only after the component has mounted on the client.
 * Use to guard browser-only logic (window, document, etc).
 *
 * Example usage:
 *   const hasMounted = useHasMounted();
 *   if (!hasMounted) return null; // Or a loading spinner
 *   // Safe to use window/document here
 */
export function useHasMounted(): boolean {
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);
	return hasMounted;
}
