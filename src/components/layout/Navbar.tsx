"use client";

import { useAuthModal } from "@/components/auth/use-auth-store";
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
} from "@/components/ui/navigation-menu";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { navItems } from "@/data/layout/nav";
import { useHasMounted } from "@/hooks/useHasMounted";
import { Z_INDEX } from "@/lib/constants/z-index";
import { isBannerClosed, setBannerClosed } from "@/lib/utils/cookies";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "../theme/theme-toggle";
import { BetaStickyBanner } from "./BetaStickyBanner";

const NavLink = ({ item, onClick, className = "" }) => {
	const pathname = usePathname();
	const isActive = pathname === item.href;
	const lowerTitle = item.title.toLowerCase();
	const isHighlighted =
		lowerTitle.includes("beta") ||
		lowerTitle.includes("pilot") ||
		lowerTitle.includes("contact");

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

const MegaMenuLink = ({ href, title, icon, className, onClick = undefined }) => {
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
			onClick={onClick || undefined}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{title}
		</Link>
	);
};

const DesktopNav = () => {
	return (
		<NavigationMenu className="hidden lg:flex">
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
													className="relative flex flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm md:col-span-2 md:flex-row md:items-center dark:shadow-md"
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
															<span className="text-muted-foreground text-sm">
																{child.ctaSubtitle}
															</span>
														)}
														{/* Newsletter Signup replaces CTA button */}
														<div className="mt-2 flex flex-col gap-2">
															<span className="font-bold text-foreground text-xs">
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

type MobileNavProps = {
	isOpen: boolean;
	onClose: () => void;
	isAuthenticated: boolean;
	isAuthLoading: boolean;
	onSignOut: () => void;
	onSignIn: () => void;
	onSignUp: () => void;
};

const MobileNav = ({
	isOpen,
	onClose,
	isAuthenticated,
	isAuthLoading,
	onSignOut,
	onSignIn,
	onSignUp,
}: MobileNavProps) => {
	const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
	const { resolvedTheme } = useTheme();
	const [_mounted, setMounted] = useState(false);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Check both resolvedTheme and HTML class as fallback
		const checkDarkMode = () => {
			const htmlHasDark = document.documentElement.classList.contains("dark");
			const themeIsDark = resolvedTheme === "dark";
			setIsDark(themeIsDark || htmlHasDark);
		};

		checkDarkMode();

		// Watch for theme changes
		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, [resolvedTheme]);

	const toggleSubmenu = (title) => {
		setOpenSubmenus((prev) => ({
			...prev,
			[title]: !prev[title],
		}));
	};

	return (
		<div
			className={cn(
				"fixed inset-0 z-[9999] flex h-screen min-h-screen flex-col backdrop-blur-xl transition-all duration-300",
				"bg-white/95 dark:bg-slate-950/98",
				isOpen
					? "visible opacity-100"
					: "pointer-events-none invisible opacity-0",
			)}
			style={{
				height: "100vh",
				minHeight: "100vh",
				backgroundColor: isDark ? "rgb(2, 6, 23)" : "rgba(255, 255, 255, 0.95)",
			}}
		>
			<div className="-z-10 absolute inset-0 overflow-hidden">
				{isOpen && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						{isDark ? (
							<PixelatedCanvas
								src="https://assets.aceternity.com/manu-red.png"
								width={900}
								height={1400}
								cellSize={4}
								dotScale={0.96}
								backgroundColor="rgba(7, 13, 27, 0.55)"
								dropoutStrength={0.1}
								interactive
								distortionStrength={10}
								distortionRadius={220}
								jitterStrength={3.5}
								jitterSpeed={0.75}
								followSpeed={0.06}
								tintColor="rgba(78, 234, 255, 0.7)"
								tintStrength={0.4}
								autoAnimate={isOpen}
								autoAnimateRadius={104}
								autoAnimateSpeed={0.088}
								className="pointer-events-none h-[140%] w-[140%] max-w-none opacity-90"
							/>
						) : (
							<PixelatedCanvas
								src="https://assets.aceternity.com/manu-red.png"
								width={900}
								height={1400}
								cellSize={4}
								dotScale={0.96}
								backgroundColor="rgba(255, 255, 255, 0.4)"
								dropoutStrength={0.1}
								interactive
								distortionStrength={10}
								distortionRadius={220}
								jitterStrength={3.5}
								jitterSpeed={0.75}
								followSpeed={0.06}
								tintColor="rgba(12, 99, 152, 0.5)"
								tintStrength={0.3}
								autoAnimate={isOpen}
								autoAnimateRadius={104}
								autoAnimateSpeed={0.088}
								className="pointer-events-none h-[140%] w-[140%] max-w-none opacity-60"
							/>
						)}
					</div>
				)}
				{isDark && (
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.4),_transparent_70%)]" />
				)}
				{isDark ? (
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050d1d]/15 via-[#050d1d]/25 to-[#050d1d]/60" />
				) : (
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50/30 via-slate-50/40 to-white/60" />
				)}
			</div>

			<div className="absolute top-[52px] right-0 z-40 flex w-full justify-end px-4 py-3 sm:top-[60px] sm:px-6 sm:py-4 lg:top-[68px]">
				<button
					onClick={onClose}
					type="button"
					className="rounded-md p-2 text-slate-900 transition-colors hover:bg-slate-100/50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
					aria-label="Close menu"
				>
					<X className="h-6 w-6" />
				</button>
			</div>

			<div className="relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 pt-[76px] pb-8 sm:px-6 sm:pt-[84px] sm:pb-10 lg:pt-[92px]">
				<ul className="mx-auto flex w-full max-w-md flex-col space-y-2 pb-6">
					{navItems.map((item) => (
						<li key={item.title} className="w-full">
							{item.children ? (
								<div className="w-full">
									<button
										onClick={() => toggleSubmenu(item.title)}
										type="button"
										className="flex w-full items-center justify-between rounded-md px-4 py-3 text-center text-slate-900 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
									>
										<span className="flex-grow font-medium text-base">
											{item.title}
										</span>
										<ChevronDown
											className={cn(
												"ml-2 h-4 w-4 text-slate-700 transition-transform duration-200 dark:text-white/80",
												openSubmenus[item.title] && "rotate-180 transform",
											)}
										/>
									</button>
									<div
										className={cn(
											"transition-all duration-300",
											openSubmenus[item.title]
												? "mt-1 mb-2 max-h-[calc(100vh-20rem)] overflow-y-auto opacity-100"
												: "max-h-0 overflow-hidden opacity-0",
										)}
									>
										<ul className="space-y-2 py-2 pb-4">
											{item.children.map((child) => (
												<li key={child.title} className="flex justify-center">
													{child.image ||
													child.ctaTitle ||
													child.ctaSubtitle ||
													child.ctaButton ? (
														<div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-sm dark:border-border dark:bg-card dark:text-card-foreground">
															{child.image && (
																<div className="relative mb-3 h-24 w-full overflow-hidden rounded-md">
																	<Image
																		src={child.image}
																		alt={child.ctaTitle || child.title}
																		fill
																		className="object-cover"
																	/>
																</div>
															)}
															<div className="flex flex-col gap-2">
																<span className="font-semibold text-primary text-xs uppercase">
																	{child.ctaTitle || child.title}
																</span>
																{child.ctaSubtitle && (
																	<span className="text-slate-600 text-sm dark:text-muted-foreground">
																		{child.ctaSubtitle}
																	</span>
																)}
																<NewsletterEmailInput />
															</div>
														</div>
													) : (
														<MegaMenuLink
															href={child.href}
															title={child.title}
															icon={
																child.icon && <child.icon className="h-4 w-4" />
															}
															className=""
															onClick={onClose}
														/>
													)}
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
					<li className="mt-4 border-slate-200 border-t pt-4 dark:border-white/10">
						<div className="flex justify-center">
							<ThemeToggle
								variant="ghost"
								size="sm"
								className="text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
							/>
						</div>
					</li>
					{isAuthenticated && !isAuthLoading && (
						<li className="pt-2">
							<Button
								variant="outline"
								className="w-full"
								onClick={() => {
									onClose();
									onSignOut();
								}}
							>
								Sign out
							</Button>
						</li>
					)}
					{!isAuthenticated && !isAuthLoading && (
						<>
							<li className="pt-2">
								<Button
									variant="default"
									className="w-full"
									onClick={() => {
										onClose();
										onSignUp();
									}}
								>
									Sign up
								</Button>
							</li>
							<li className="pt-2">
								<Button
									variant="outline"
									className="w-full"
									onClick={() => {
										onClose();
										onSignIn();
									}}
								>
									Sign in
								</Button>
							</li>
						</>
					)}
				</ul>
			</div>

			<div className="mt-auto mb-8 flex w-full justify-center px-6">
				<div className="w-full max-w-[200px]">
					{/* Black logo for light mode */}
					<Image
						width={400}
						height={400}
						src="/company/logos/DealScale_Horizontal_Black.png"
						alt="Deal Scale"
						className="block h-auto w-full dark:hidden"
					/>
					{/* White logo for dark mode */}
					<Image
						width={400}
						height={400}
						src="/company/logos/Deal_Scale_Horizontal_White.png"
						alt="Deal Scale"
						className="hidden h-auto w-full dark:block"
					/>
				</div>
			</div>
		</div>
	);
};

export default function Navbar() {
	const [showBanner, setShowBanner] = useState(false);
	const [showNavbar, setShowNavbar] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const lastScrollY = useRef(0);
	const scrollThreshold = 10; // Minimum scroll distance to trigger show/hide
	const mobileMenuOpenRef = useRef(false);

	const hasMounted = useHasMounted();
	const [bannerMounted, setBannerMounted] = useState(false);
	const pathname = usePathname();

	// Pages where banner should NOT show
	const bannerExcludedPages = ["/contact", "/contact-pilot"];
	// Pages where banner should ALWAYS show (if not closed)
	const bannerAlwaysShowPages = ["/affiliate"];

	// Sync mobileMenuOpen to ref for use in scroll handler
	useEffect(() => {
		mobileMenuOpenRef.current = mobileMenuOpen;
	}, [mobileMenuOpen]);

	// Track scroll direction and control navbar/banner visibility
	useEffect(() => {
		if (typeof window === "undefined") return;

		let isMounted = true;
		let ticking = false;

		const handleScroll = () => {
			// Don't handle scroll when mobile menu is open
			if (!isMounted || ticking || mobileMenuOpenRef.current) {
				if (ticking) ticking = false;
				return;
			}

			ticking = true;
			requestAnimationFrame(() => {
				if (!isMounted || mobileMenuOpenRef.current) {
					ticking = false;
					return;
				}

				const currentScrollY = window.scrollY;
				const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);

				// Only update if scrolled enough to avoid jitter
				// Use slightly higher threshold on mobile for smoother experience
				const threshold =
					window.innerWidth < 640 ? scrollThreshold * 1.5 : scrollThreshold;
				if (scrollDifference < threshold) {
					ticking = false;
					return;
				}

				// Check if banner should be shown on current page
				const currentPath = window.location.pathname;
				const isExcludedPage = bannerExcludedPages.some((page) =>
					currentPath.startsWith(page),
				);
				const isAffiliatePage = bannerAlwaysShowPages.some((page) =>
					currentPath.startsWith(page),
				);
				const bannerClosed = isBannerClosed();

				// At top of page: always show navbar, hide banner
				if (currentScrollY <= 0) {
					setShowNavbar(true);
					setShowBanner(false);
					lastScrollY.current = currentScrollY;
					ticking = false;
					return;
				}

				// Scrolling down: hide navbar, show banner (if allowed)
				if (currentScrollY > lastScrollY.current) {
					setShowNavbar(false);
					// Only show banner if:
					// 1. Not on excluded pages (contact, contact-pilot)
					// 2. Either on affiliate page OR not closed
					if (!isExcludedPage && (isAffiliatePage || !bannerClosed)) {
					setShowBanner(true);
					} else {
						setShowBanner(false);
					}
				}
				// Scrolling up: show navbar, hide banner
				else if (currentScrollY < lastScrollY.current) {
					setShowNavbar(true);
					setShowBanner(false);
				}

				lastScrollY.current = currentScrollY;
				ticking = false;
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			isMounted = false;
			window.removeEventListener("scroll", handleScroll);
		};
	}, [pathname]);

	const { status } = useSession();
	const openAuthModal = useAuthModal((state) => state.open);

	useEffect(() => {
		if (!hasMounted) return;
		if (mobileMenuOpen) {
			document.body.style.overflow = "hidden";
			// Keep navbar visible when mobile menu is open
			// Also reset scroll position tracking to prevent banner from appearing
			// when menu closes if user was scrolling
			setShowNavbar(true);
			setShowBanner(false);
			// Reset scroll tracking when menu opens to prevent issues when it closes
			if (typeof window !== "undefined") {
				lastScrollY.current = window.scrollY;
			}
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [mobileMenuOpen, hasMounted]);

	// Mount banner portal after client-side hydration
	useEffect(() => {
		setBannerMounted(true);
	}, []);

	const isAuthenticated = status === "authenticated";

	const handleSignOut = () => {
		void signOut({ callbackUrl: "/" });
	};

	const handleSignIn = () => {
		openAuthModal("signin");
	};

	const handleSignUp = () => {
		openAuthModal("signup");
	};

	return (
		<>
			<nav
				className={cn(
					"fixed top-0 right-0 left-0 border-border/40 border-b bg-background/95 px-4 py-3 backdrop-blur-sm transition-transform duration-300 ease-in-out sm:px-6 sm:py-4 lg:px-8",
					showNavbar ? "translate-y-0" : "-translate-y-full",
				)}
				style={{ zIndex: Z_INDEX.NAVBAR }}
				aria-label="Main navigation"
			>
				<div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between sm:h-[60px] lg:h-[68px]">
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

					<DesktopNav />

					<div className="hidden items-center space-x-2 lg:flex">
						{isAuthenticated && (
							<Button variant="outline" size="sm" onClick={handleSignOut}>
								Sign out
							</Button>
						)}
						{!isAuthenticated && status !== "loading" && (
							<Button variant="default" size="sm" onClick={handleSignIn}>
								Sign in
							</Button>
						)}
					</div>

					<button
						className="z-20 text-black lg:hidden dark:text-white"
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
						isAuthenticated={isAuthenticated}
						isAuthLoading={status === "loading"}
						onSignOut={handleSignOut}
						onSignIn={handleSignIn}
						onSignUp={handleSignUp}
					/>
				</div>
			</nav>
			{/* StickyBanner appears when scrolling down, navbar appears when scrolling up */}
			{/* Render banner via portal to body to prevent clipping by parent containers */}
			{bannerMounted &&
				typeof window !== "undefined" &&
				createPortal(
					<StickyBanner
						open={showBanner}
						onClose={() => {
							setShowBanner(false);
							// Save closed state in cookie for 24 hours
							setBannerClosed();
						}}
						variant="default"
						className={cn(
							"fixed right-0 left-0 border-t-0 px-2 py-2 text-sm transition-transform duration-300 ease-in-out sm:px-4 sm:py-2 lg:px-4 lg:py-3 lg:text-base",
							showBanner ? "top-0 translate-y-0" : "-translate-y-full",
						)}
						style={{
							zIndex: Z_INDEX.STICKY_BANNER,
							overflow: "visible",
							minHeight: "auto",
							height: "auto",
							maxHeight: "none",
						}}
					>
						<BetaStickyBanner />
					</StickyBanner>,
					document.body,
				)}
		</>
	);
}
