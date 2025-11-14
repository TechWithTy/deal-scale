import { JetBrains_Mono, Manrope } from "next/font/google";

export const sansFont = Manrope({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
	weight: ["300", "400", "500", "600", "700"],
});

export const monoFont = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-mono",
	weight: ["400", "500", "600", "700"],
});
