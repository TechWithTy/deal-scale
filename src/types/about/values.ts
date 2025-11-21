export interface ValueItem {
	title: string;
	description: string;
	icon?: string; // Optional icon name or path for visual emphasis
	details?: string; // Optional in-depth explanation or context
	impactStatement?: string; // Short statement on how this value benefits customers
	examples?: string[]; // Example actions or behaviors demonstrating this value
	highlight?: boolean; // Flag for special emphasis in UI
}
