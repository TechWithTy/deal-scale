import { NewsletterEmailInput } from "@/components/contact/newsletter/NewsletterEmailInput";
import { StickyBanner } from "@/components/ui/StickyBanner";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { navItems } from "@/data/layout/nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { ThemeToggle } from "../theme/theme-toggle";
const NavLink = ({ item, onClick, className = "" }) => {
	const pathname = usePathname();
	const isActive = pathname === item.href;
	const isHighlighted =
		item.title.toLowerCase().includes("beta") ||
		item.title.toLowerCase().includes("pilot");

	return (
		<Link
			href={item.href}
			className={cn(
				// * Base nav link
				"rounded-md px-3 py-2 font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
				// ! Light mode: improved hover for non-highlighted
				!className && "text-black hover:bg-gray-100 hover:text-black",
				// * Active state
				isActive && !className && "bg-gray-100 font-semibold text-black",
				// * Highlighted/CTA (Contact/Schedule)
				isHighlighted &&
					"ml-4 rounded-md border-2 border-primary/60 bg-gradient-to-r from-primary to-focus px-4 py-2 font-semibold text-white shadow-none transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
				// ! Dark mode stays as before
				"dark:text-white dark:focus-visible:outline-primary dark:hover:bg-primary/10",
				isActive && !className && "dark:bg-white/10 dark:text-white",
				isHighlighted &&
					"shadow-none dark:border-primary/80 dark:text-white dark:shadow-none",
				className,
			)}
			onClick={onClick}
		>
			{item.title}
		</Link>
	);
};

const MegaMenuLink = ({ href, title, icon, className }) => {
	const isHighlighted =
		title.toLowerCase().includes("contact") ||
		title.toLowerCase().includes("schedule");
	return (
		<Link
			href={href}
			className={cn(
				// Base style
				"group flex items-center rounded px-3 py-2 font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
				// Light & Dark mode text
				"text-foreground hover:bg-accent hover:text-accent-foreground",
				// Highlighted/CTA
				isHighlighted &&
					"rounded-md border-2 border-primary/60 bg-gradient-to-r from-primary to-focus px-4 py-2 font-bold text-white shadow-md transition-opacity hover:opacity-90 dark:border-primary/80 dark:text-white dark:shadow-lg",
				className,
			)}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{title}
		</Link>
	);
};

const DesktopNav = () => {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList
				className={cn("flex space-x-1 transition-all duration-300")}
			>
				{navItems.map((item) => (
					<NavigationMenuItem key={item.title}>
						{item.children ? (
							<>
								<NavigationMenuTrigger className="flex items-center justify-center gap-1 rounded-md bg-transparent px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent/50 dark:data-[state=open]:bg-accent">
									{item.title}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<div className="grid w-[400px] gap-3 bg-popover p-4 text-popover-foreground md:w-[600px] md:grid-cols-2 dark:border dark:border-primary/60 dark:shadow-2xl">
										{item.children.map((child) =>
											child.image ||
											child.ctaTitle ||
											child.ctaSubtitle ||
											child.ctaButton ? (
												// * Render CTA Card if any CTA fields are present
												<div
													key={child.title}
													className="relative flex flex-col gap-4 rounded-lg border border-primary bg-gradient-to-tr from-white via-gray-50 to-primary/10 p-4 shadow-lg md:col-span-2 md:flex-row md:items-center dark:border-primary/70 dark:bg-background-dark/80 dark:text-white dark:shadow-2xl"
												>
													{child.image && (
														<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md md:h-32 md:w-32">
															<Image
																src={child.image}
																alt={child.ctaTitle || child.title}
																fill
																className="object-cover"
															/>
														</div>
													)}
													<div className="flex flex-1 flex-col gap-2">
														<span className="font-semibold text-primary text-xs uppercase">
															{child.ctaTitle || child.title}
														</span>
														{child.ctaSubtitle && (
															<span className="text-black text-sm dark:text-white/80">
																{child.ctaSubtitle}
															</span>
														)}
														{/* Newsletter Signup replaces CTA button */}
														<div className="mt-2 flex flex-col gap-2">
															<span className="font-bold text-primary text-xs">
																Sign up for our newsletter
															</span>
															<NewsletterEmailInput />
														</div>
													</div>
												</div>
											) : (
												<MegaMenuLink
													key={child.title}
													href={child.href}
													title={child.title}
													icon={
														child.icon && <child.icon className="h-4 w-4" />
													}
													className=""
												/>
											),
										)}
									</div>
								</NavigationMenuContent>
							</>
						) : (
							<NavigationMenuLink asChild>
								<NavLink item={item} onClick={undefined} />
							</NavigationMenuLink>
						)}
					</NavigationMenuItem>
				))}
				<NavigationMenuItem className="ml-2">
					<ThemeToggle
						variant="ghost"
						size="sm"
						className="text-black hover:bg-gray-100 hover:text-primary dark:text-white dark:hover:bg-primary/10 dark:hover:text-white"
					/>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const MobileNav = ({ isOpen, onClose }) => {
	const [openSubmenus, setOpenSubmenus] = useState({});

	const toggleSubmenu = (title) => {
		setOpenSubmenus((prev) => ({
			...prev,
			[title]: !prev[title],
		}));
	};

	return (
		<div
			className={cn(
				"fixed inset-0 z-[100] flex flex-col items-center bg-background-dark/95 backdrop-blur-xl transition-all duration-300",
				isOpen
					? "visible opacity-100"
					: "pointer-events-none invisible opacity-0",
			)}
			style={{
				top: "var(--header-height, 0px)",
			}}
		>
			<div className="absolute top-0 flex w-full justify-end px-6 py-4">
				<button
					onClick={onClose}
					type="button"
					className="p-2 text-black transition-colors hover:text-black dark:text-white"
					aria-label="Close menu"
				>
					<X className="h-6 w-6" />
				</button>
			</div>

			<div className="w-full overflow-y-auto px-6 pt-20">
				<ul className="mx-auto flex max-h-[calc(100vh-var(--header-height)-8rem)] w-full max-w-md flex-col space-y-2">
					{navItems.map((item) => (
						<li key={item.title} className="w-full">
							{item.children ? (
								<div className="w-full">
									<button
										onClick={() => toggleSubmenu(item.title)}
										type="button"
										className="flex w-full items-center justify-between rounded-md px-4 py-3 text-center text-black transition-colors hover:bg-white/10 hover:text-black dark:text-white dark:text-white/80"
									>
										<span className="flex-grow font-medium text-base">
											{item.title}
										</span>
										<ChevronDown
											className={cn(
												"ml-2 h-4 w-4 transition-transform duration-200",
												openSubmenus[item.title] && "rotate-180 transform",
											)}
										/>
									</button>
									<div
										className={cn(
											"overflow-hidden transition-all duration-300",
											openSubmenus[item.title]
												? "mt-1 mb-2 max-h-96 opacity-100"
												: "max-h-0 opacity-0",
										)}
									>
										<ul className="space-y-2 py-2">
											{item.children.map((child) => (
												<li key={child.title} className="flex justify-center">
													<MegaMenuLink
														href={child.href}
														title={child.title}
														icon={
															child.icon && <child.icon className="h-4 w-4" />
														}
														className=""
													/>
												</li>
											))}
										</ul>
									</div>
								</div>
							) : (
								<div className="flex justify-center">
									<NavLink item={item} onClick={onClose} />
								</div>
							)}
						</li>
					))}
					<li className="mt-4 border-white/10 border-t pt-4">
						<div className="flex justify-center">
							<ThemeToggle
								variant="ghost"
								size="sm"
								className="text-black hover:bg-white/10 hover:text-black dark:text-white dark:text-white/80"
							/>
						</div>
					</li>
				</ul>
			</div>

			<div className="mt-auto mb-8 w-full max-w-[200px] px-6">
				<Image
					width={400}
					height={400}
					src="/company/logos/Deal_Scale_Horizontal_White.png"
					alt="Logo"
					className="h-auto w-full"
				/>
			</div>
		</div>
	);
};

export default function Navbar() {
	const [showBanner, setShowBanner] = useState(false);
	const observeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ref = observeRef.current;
		if (!ref) return;
		const observer = new window.IntersectionObserver(
			([entry]) => setShowBanner(!entry.isIntersecting),
			{ threshold: 0 },
		);
		observer.observe(ref);
		return () => observer.disconnect();
	}, []);

	const hasMounted = useHasMounted();

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const isMobile = useIsMobile();
	const router = useRouter();

	useEffect(() => {
		if (!hasMounted) return;
		if (mobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [mobileMenuOpen, hasMounted]);

	return (
		<>
			<nav
				className="fixed top-0 right-0 left-0 z-50 bg-background px-6 py-4 lg:px-8"
				aria-label="Main navigation"
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<Link href="/" className="z-20 flex items-center">
						{/* Black logo for light mode */}
						<Image
							src="/company/logos/DealScale_Horizontal_Black.png"
							alt="Deal Scale"
							width={100}
							height={10}
							className="block h-auto dark:hidden"
						/>
						{/* White logo for dark mode */}
						<Image
							src="/company/logos/Deal_Scale_Horizontal_White.png"
							alt="Deal Scale"
							width={100}
							height={10}
							className="hidden h-auto dark:block"
						/>
					</Link>

					{!isMobile && <DesktopNav />}

					<div className="flex items-center space-x-4" />

					<button
						className="z-20 text-black md:hidden dark:text-white"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						type="button"
						aria-expanded={mobileMenuOpen}
						aria-controls="mobile-menu"
						aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{mobileMenuOpen ? <X className="w-6" /> : <Menu className="w-6" />}
					</button>

					<MobileNav
						isOpen={mobileMenuOpen}
						onClose={() => setMobileMenuOpen(false)}
					/>
				</div>
			</nav>
			{/* Marker for IntersectionObserver */}
			<div ref={observeRef} style={{ height: 1 }} aria-hidden="true" />
			{/* StickyBanner appears after scrolling down */}
			<StickyBanner
				open={showBanner}
				onClose={() => setShowBanner(false)}
				variant="default"
				className="top-[56px] px-2 py-2 text-sm lg:top-[64px] lg:px-4 lg:py-3 lg:text-base"
			>
				<span className="font-semibold">🆓 5 Leads:&nbsp;</span>
				<span className="inline md:hidden">Join beta!</span>
				<span className="hidden md:inline">
					Apply to join our exclusive beta testing program!
				</span>
				<Link href="/contact" className="ml-2 underline">
					Apply here
				</Link>
			</StickyBanner>
		</>
	);
}
