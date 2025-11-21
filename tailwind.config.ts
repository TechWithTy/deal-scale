import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	// Production optimizations
	...(!process.env.SKIP_TAILWIND_PURGE && {
		// Ensure Tailwind purges unused CSS in production
		// This is enabled by default but explicitly set for clarity
	}),
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
			},
		},
		extend: {
			// ! All color tokens reference CSS variables defined in theme blocks (see index.css)
			// * To add a new theme, create a .theme-{project} class and define color variables there.
			// * Example: .theme-cyberoni, .theme-cyberoni-light, .theme-lumina, etc.
			colors: {
				light: {
					DEFAULT: "hsl(var(--text-light))", // * Uses theme variable for dynamic theming
				},
				dark: {
					DEFAULT: "hsl(var(--text-dark))", // * Uses theme variable for dynamic theming
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				backgroundDark: "hsl(var(--background-dark))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				tertiary: {
					DEFAULT: "hsl(var(--tertiary))",
					foreground: "hsl(var(--tertiary-foreground))",
				},
				focus: {
					DEFAULT: "hsl(var(--focus))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// Deal Scale Brand Colors
				brand: {
					primary: "hsl(var(--brand-primary))",
					primaryHover: "hsl(var(--brand-primary-hover))",
					accent: "hsl(var(--brand-accent))",
					accentHover: "hsl(var(--brand-accent-hover))",
					warm: "hsl(var(--brand-warm))",
					warmHover: "hsl(var(--brand-warm-hover))",
				},
				// Deal Scale Surface System
				surface: {
					DEFAULT: "hsl(var(--surface))",
					alt: "hsl(var(--surface-alt))",
					elevated: "hsl(var(--surface-elevated))",
				},
				// Deal Scale Text System
				text: {
					main: "hsl(var(--text-main))",
					subtle: "hsl(var(--text-subtle))",
					muted: "hsl(var(--text-muted))",
				},
				cyber: {
					blue: "#2D9CDB",
					purple: "#6C63FF",
					dark: "#0F172A",
					darker: "#080F1F",
					neon: "#4EEAFF",
					glow: "#3B82F6",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-out": {
					"0%": { opacity: "1", transform: "translateY(0)" },
					"100%": { opacity: "0", transform: "translateY(10px)" },
				},
				"pulse-glow": {
					"0%, 100%": {
						opacity: "1",
						filter: "brightness(1)",
					},
					"50%": {
						opacity: "0.8",
						filter: "brightness(1.2)",
					},
				},
				"pulse-glow-slow": {
					"0%, 100%": {
						opacity: "1",
						filter: "brightness(1)",
					},
					"50%": {
						opacity: "0.8",
						filter: "brightness(1.2)",
					},
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				marquee: {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(calc(-100% - var(--gap)))" },
				},
				"marquee-vertical": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(calc(-100% - var(--gap)))" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out forwards",
				"fade-out": "fade-out 0.5s ease-out forwards",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"pulse-glow-slow": "pulse-glow-slow 8s ease-in-out infinite",
				float: "float 6s ease-in-out infinite",
				"scale-in": "scale-in 0.3s ease-out forwards",
				marquee: "marquee var(--duration) linear infinite",
				"marquee-vertical": "marquee-vertical var(--duration) linear infinite",
			},
			backgroundImage: {
				"cyber-gradient":
					"linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(8, 15, 31, 0.9) 100%)",
				"glow-gradient":
					"radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0) 70%)",
				"blue-pulse":
					"radial-gradient(circle, rgba(45, 156, 219, 0.15) 0%, rgba(15, 23, 42, 0) 70%)",
				"grid-lines":
					"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(59, 130, 246, 0.1)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E\")",
				"theme-glow":
					"radial-gradient(circle, rgba(var(--primary) / 0.3) 0%, rgba(var(--primary) / 0) 70%)",
				"text-light": "hsl(var(--text-light))",
				"text-dark": "hsl(var(--text-dark))",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		({ addUtilities }) => {
			const newUtilities = {
				".glow": {
					"@apply relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-focus/10 before:opacity-50":
						{},
				},
				".glow-hover": {
					"@apply hover:shadow-lg hover:shadow-primary/20 hover:before:opacity-70 transition-all duration-300":
						{},
				},
				".glow-active": {
					"@apply shadow-lg shadow-primary/30 before:opacity-70": {},
				},
				".text-light": {
					"@apply text-white dark:text-gray-900": {},
				},
				".text-dark": {
					"@apply text-gray-900 dark:text-white": {},
				},
			};
			addUtilities(newUtilities);
		},
	],
} satisfies Config;
