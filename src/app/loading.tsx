// Scoped global loading overlay can cause flashes during navigation.
// Return null to avoid a full-screen overlay and rely on per-section fallbacks.
export default function Loading() {
	return null;
}
