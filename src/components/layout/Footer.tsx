import { NewsletterFooter } from "@/components/contact/newsletter/NewsletterFooter";
import { FooterPersonaPrompt } from "./FooterPersonaPrompt";
import { FooterBetaCta } from "./FooterBetaCta";
import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	type LucideIcon,
	Mail,
	MapPin,
	Phone,
	Twitter,
	Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export interface FooterProps {
	companyName: string;
	companyLegalName?: string;
	companyDescription: string;
	socialLinks: {
		github?: string;
		twitter?: string;
		linkedin?: string;
		mediumUsername?: string;
		facebook?: string;
		instagram?: string;
		youtube?: string;
	};
	quickLinks: Array<{ href: string; label: string }>;
	contactInfo: {
		email: string;
		phone: string;
		address: string;
	};
	privacyPolicyLink: string;
	termsOfServiceLink: string;
	cookiePolicyLink: string;
	supportLink: string;
	careersLink: string;
}

export const Footer: React.FC<FooterProps> = ({
	companyName,
	companyLegalName,
	companyDescription,
	socialLinks,
	quickLinks,
	contactInfo,
	privacyPolicyLink,
	termsOfServiceLink,
	cookiePolicyLink,
}) => {
	const currentYear = new Date().getFullYear();
	type SocialLinkKey = Exclude<
		keyof FooterProps["socialLinks"],
		"mediumUsername"
	>;

	const socialIconClass =
		"group flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/80 text-black shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-primary/60 dark:hover:bg-primary/10";

	const socialIconConfigs: Array<{
		key: SocialLinkKey;
		Icon: LucideIcon;
		label: string;
	}> = [
		{ key: "github", Icon: Github, label: "GitHub" },
		{ key: "instagram", Icon: Instagram, label: "Instagram" },
		{ key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
		{ key: "facebook", Icon: Facebook, label: "Facebook" },
		{ key: "twitter", Icon: Twitter, label: "Twitter / X" },
		{ key: "youtube", Icon: Youtube, label: "YouTube" },
	];

	return (
		<footer className="relative border-white/10 border-t bg-background-dark">
			<div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-10" />

			<div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:justify-items-center md:text-center lg:grid-cols-4 lg:items-start lg:justify-items-start lg:text-left lg:gap-6">
					<div className="col-span-1 flex flex-col items-center text-center md:col-span-2 md:justify-center md:text-center lg:col-span-1 lg:items-start lg:text-left">
						<div className="mb-4 flex w-full justify-center lg:justify-start">
							<Link href="/" className="w-full max-w-[200px] lg:max-w-none">
								{/* Show dark text logo on light mode */}
								<Image
									src="/company/logos/DealScale_Horizontal_Black.png"
									alt="Deal Scale"
									width={300}
									height={76}
									className="block h-auto w-full dark:hidden"
									priority
								/>
								{/* Show light text logo on dark mode */}
								<Image
									src="/company/logos/Deal_Scale_Horizontal_White.png"
									alt="Deal Scale"
									width={300}
									height={76}
									className="hidden h-auto w-full dark:block"
									priority
								/>
							</Link>
						</div>
						<p className="mb-4 max-w-sm text-black text-sm dark:text-white/70">
							{companyDescription}
						</p>
						<div className="flex justify-center gap-3 lg:justify-start">
							{socialIconConfigs.map(({ key, Icon, label }) => {
								const url = socialLinks[key];

								if (!url) {
									return null;
								}

								return (
									<a
										key={key}
										target="_blank"
										rel="noopener noreferrer"
										href={url}
										className={socialIconClass}
										aria-label={label}
										title={label}
									>
										<Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
									</a>
								);
							})}
						</div>
					</div>

					<div className="text-center md:col-span-2 lg:col-span-1">
						<h3 className="mb-4 font-semibold text-lg">Quick Links</h3>
						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={uuidv4()}>
									<Link
										target="_blank"
										href={link.href}
										className="text-black transition-colors hover:text-black dark:text-white dark:text-white/70"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col items-center text-center md:col-span-2 md:items-center md:text-center lg:col-span-1 lg:items-start lg:text-left">
						<h3 className="mb-4 font-semibold text-lg">Get in Touch</h3>
						<ul className="w-full space-y-3">
							<li>
								<a
									target="_blank"
									href={`mailto:${contactInfo.email}`}
									className="flex items-center justify-center text-black transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
									rel="noreferrer"
								>
									<Mail className="mr-2 h-4 w-4" />
									{contactInfo.email}
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href={`tel:${contactInfo.phone}`}
									className="flex items-center justify-center text-black transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
									rel="noreferrer"
								>
									<Phone className="mr-2 h-4 w-4" />
									{contactInfo.phone}
								</a>
							</li>
							<li>
								<div className="flex items-center justify-center text-black dark:text-white">
									<MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
									<span>{contactInfo.address}</span>
								</div>
							</li>
						</ul>
						<div className="mt-4 flex w-full justify-center lg:justify-start">
							<FooterBetaCta className="w-full max-w-sm" />
						</div>
						<FooterPersonaPrompt className="mt-4 text-center md:mt-6 md:text-center lg:text-left" />
					</div>

					<div className="col-span-1 flex flex-col items-center md:col-span-2 md:text-center lg:col-span-1">
						<h3 className="mb-4 text-center font-semibold text-lg">
							Subscribe to our newsletter
						</h3>
						<div className="flex w-full justify-center">
							<NewsletterFooter />
						</div>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center border-white/10 border-t pt-8 md:space-y-4 md:items-center lg:flex-row lg:justify-between lg:space-y-0">
					<p className="mb-4 text-center text-black text-sm md:mb-0 dark:text-white/60">
						&copy; {currentYear} {companyName}. All rights reserved.
					</p>
					<div className="flex flex-col space-y-2 sm:flex-row sm:flex-wrap sm:justify-center sm:space-x-4 sm:space-y-2 lg:space-y-0 lg:space-x-6 lg:justify-end">
						<Link
							href="/legal"
							className="text-black text-sm hover:text-black dark:text-white dark:text-white/60"
						>
							Legal Center
						</Link>
						<Link
							href={privacyPolicyLink}
							className="text-black text-sm hover:text-black dark:text-white dark:text-white/60"
						>
							Privacy Policy
						</Link>
						<Link
							href={termsOfServiceLink}
							className="text-black text-sm hover:text-black dark:text-white dark:text-white/60"
						>
							Terms of Service
						</Link>
						<Link
							href={cookiePolicyLink}
							className="text-black text-sm hover:text-black dark:text-white dark:text-white/60"
						>
							Cookie Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};
