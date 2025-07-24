// Auth Theme Configuration
export const authTheme = {
	// Button styles
	button: {
		base: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
		variants: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline:
				"border border-input hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "underline-offset-4 hover:underline text-primary",
		},
		sizes: {
			default: "h-10 py-2 px-4",
			sm: "h-9 px-3 rounded-md",
			lg: "h-11 px-8 rounded-md",
			icon: "h-10 w-10",
		},
	},

	// Input styles
	input: {
		base: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	},

	// Card styles
	card: {
		base: "rounded-lg border bg-card text-card-foreground shadow-sm",
		header: "flex flex-col space-y-1.5 p-6",
		title: "text-2xl font-semibold leading-none tracking-tight",
		description: "text-sm text-muted-foreground",
		content: "p-6 pt-0",
		footer: "flex items-center p-6 pt-0",
	},

	// Alert styles
	alert: {
		base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
		variant: {
			default: "bg-background text-foreground",
			destructive:
				"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
		},
	},

	// Label styles
	label:
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",

	// Divider styles
	divider: "relative my-6",
	dividerText:
		"absolute left-1/2 -translate-x-1/2 bg-background px-2 text-sm text-muted-foreground",
};

// Animation keyframes
export const animations = {
	fadeIn: "animate-in fade-in duration-200",
	slideInFromTop: "animate-in slide-in-from-top duration-200",
	slideInFromBottom: "animate-in slide-in-from-bottom duration-200",
};

// Utility function to merge class names with theme styles
export function cn(...classes: (string | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
