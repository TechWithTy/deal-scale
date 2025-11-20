import { Github, Loader2 as Spinner } from "lucide-react";
import type { SVGProps } from "react";

const Google = (props: SVGProps<SVGSVGElement>) => (
	<svg
		role="img"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<title>Google</title>
		<path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c5.08 0 9.27-3.81 9.88-8.68H12v-3.3h7.43c.26 1.52.43 3.1.43 4.7z" />
	</svg>
);

const LinkedIn = (props: SVGProps<SVGSVGElement>) => (
	<svg
		role="img"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<title>LinkedIn</title>
		<path
			d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
			fill="currentColor"
		/>
		<rect width="4" height="12" x="2" y="9" fill="currentColor" />
		<circle cx="4" cy="4" r="2" fill="currentColor" />
	</svg>
);

const Facebook = (props: SVGProps<SVGSVGElement>) => (
	<svg
		role="img"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<title>Facebook</title>
		<path
			d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
			fill="currentColor"
		/>
	</svg>
);

export const Icons = {
	spinner: Spinner,
	google: Google,
	gitHub: Github,
	linkedIn: LinkedIn,
	facebook: Facebook,
};
