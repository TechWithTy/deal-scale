"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Upload,
	FileIcon,
	X,
	Loader2,
	Play,
	Info,
	Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { useHeroTrialCheckout } from "@/components/home/heros/useHeroTrialCheckout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { parseContactFile, type ContactData } from "@/utils/csvParser";
import {
	ReactivateCampaignBadges,
	type BadgeMetrics,
} from "./ReactivateCampaignBadges";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { ProcessingStatusList } from "./ProcessingStatusList";
import {
	Phone,
	MessageSquare,
	Database,
	CheckCircle2,
	Zap,
} from "lucide-react";

interface ReactivateCampaignInputProps {
	onActivationComplete?: (metrics: BadgeMetrics) => void;
	className?: string;
}

const PLACEHOLDER_OPTIONS = [
	"Reactivate leads",
	"Follow up on deal leads",
	"Automate outreach sequence",
	"Enrich contact data",
	"Re-engage cold prospects",
	"Schedule follow-up calls",
];

const PricingCheckoutDialog = dynamic(
	() => import("@/components/home/pricing/PricingCheckoutDialog"),
	{ ssr: false, loading: () => null },
);

export function ReactivateCampaignInput({
	onActivationComplete,
	className,
}: ReactivateCampaignInputProps) {
	const [searchValue, setSearchValue] = useState("");
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [contacts, setContacts] = useState<ContactData[]>([]);
	const [skipTrace, setSkipTrace] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [metrics, setMetrics] = useState<BadgeMetrics | null>(null);
	const [isFocused, setIsFocused] = useState(false);
	const [processingSteps, setProcessingSteps] = useState<
		Array<{
			id: string;
			label: string;
			icon: React.ReactNode;
			status: "pending" | "processing" | "completed";
		}>
	>([]);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paymentCompleted, setPaymentCompleted] = useState(false);
	const [showEnrichInfo, setShowEnrichInfo] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const { checkoutState, startTrial, closeCheckout, isTrialLoading } =
		useHeroTrialCheckout();
	const { data: session } = useSession();

	const handleFileSelect = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			// Validate file type
			const fileName = file.name.toLowerCase();
			const extension = fileName.split(".").pop();
			if (!["csv", "xlsx", "xls"].includes(extension || "")) {
				toast.error("Please upload a CSV or Excel file");
				return;
			}

			setUploadedFile(file);
			setContacts([]);
			setMetrics(null);

			// Parse file
			try {
				const result = await parseContactFile(file);
				if (result.errors.length > 0) {
					toast.warning(
						`Parsed with ${result.errors.length} error(s). Check console for details.`,
					);
					console.warn("Parse errors:", result.errors);
				}

				if (result.contacts.length === 0) {
					toast.error("No valid contacts found in file");
					setUploadedFile(null);
					return;
				}

				setContacts(result.contacts);
				toast.success(`Found ${result.contacts.length} contacts`);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to parse file",
				);
				setUploadedFile(null);
			}
		},
		[],
	);

	const handleRemoveFile = useCallback(() => {
		setUploadedFile(null);
		setContacts([]);
		setMetrics(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	const resetActivationState = useCallback(() => {
		setIsProcessing(false);
		setProcessingSteps([]);
		setShowPaymentModal(false);
		setPaymentCompleted(false);
		closeCheckout();
	}, [closeCheckout]);

	const handlePaymentSuccess = useCallback(() => {
		setPaymentCompleted(true);
		setShowPaymentModal(false);
		closeCheckout();

		// Continue with activation after payment success
		// The useEffect will trigger handleActivate when paymentCompleted becomes true
	}, [closeCheckout]);

	const handleDownloadExample = useCallback(() => {
		// Create example CSV content
		const exampleData = [
			{
				name: "John Doe",
				email: "john.doe@example.com",
				phone: "+1-555-0123",
				address: "123 Main St, Denver, CO 80202",
			},
			{
				name: "Jane Smith",
				email: "jane.smith@example.com",
				phone: "+1-555-0124",
				address: "456 Oak Ave, Boulder, CO 80301",
			},
			{
				name: "Bob Johnson",
				email: "bob.johnson@example.com",
				phone: "+1-555-0125",
				address: "789 Pine Rd, Colorado Springs, CO 80903",
			},
		];

		// Convert to CSV
		const headers = Object.keys(exampleData[0]);
		const csvRows = [
			headers.join(","),
			...exampleData.map((row) =>
				headers
					.map((header) => {
						const value = row[header as keyof typeof row] || "";
						// Escape commas and quotes in values
						if (
							typeof value === "string" &&
							(value.includes(",") || value.includes('"'))
						) {
							return `"${value.replace(/"/g, '""')}"`;
						}
						return value;
					})
					.join(","),
			),
		];

		const csvContent = csvRows.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute("download", "example-contacts.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, []);

	const handleActivate = useCallback(async () => {
		console.log("[ReactivateCampaign] Activation started", {
			contactsCount: contacts.length,
			searchValue: searchValue.trim(),
			skipTrace,
		});

		if (contacts.length === 0) {
			const errorMsg = "Please upload a file with contacts first";
			console.error("[ReactivateCampaign]", errorMsg);
			toast.error(errorMsg);
			return;
		}

		// Make search value optional - use default if empty
		const workflowRequirements =
			searchValue.trim() || "Reactivate leads and follow up";

		console.log("[ReactivateCampaign] Calling API with:", {
			contactsCount: contacts.length,
			workflowRequirements,
			skipTrace,
		});

		// Initialize processing steps
		const initialSteps = [
			{
				id: "enrich",
				label: skipTrace ? "Enriching contact data" : "Preparing contacts",
				icon: <Database className="h-4 w-4" />,
				status: "pending" as const,
			},
			{
				id: "activate",
				label: `Activating ${contacts.length} contacts`,
				icon: <Zap className="h-4 w-4" />,
				status: "pending" as const,
			},
			{
				id: "calling",
				label: "Initiating calls",
				icon: <Phone className="h-4 w-4" />,
				status: "pending" as const,
			},
			{
				id: "texting",
				label: "Sending text messages",
				icon: <MessageSquare className="h-4 w-4" />,
				status: "pending" as const,
			},
			{
				id: "complete",
				label: "Campaign activated",
				icon: <CheckCircle2 className="h-4 w-4" />,
				status: "pending" as const,
			},
		];
		setProcessingSteps(initialSteps);
		setIsProcessing(true);

		// Simulate step progression
		const updateStep = (stepId: string, status: "processing" | "completed") => {
			setProcessingSteps((prev) =>
				prev.map((step) => (step.id === stepId ? { ...step, status } : step)),
			);
		};

		// Start first step - show initial processing
		setTimeout(() => updateStep("enrich", "processing"), 300);
		setTimeout(() => updateStep("enrich", "completed"), 800);

		// After initial processing, show payment modal
		setTimeout(async () => {
			try {
				await startTrial();
				setShowPaymentModal(true);
			} catch (error) {
				console.error("[ReactivateCampaign] Failed to start trial:", error);
				// Reset state on error
				resetActivationState();
				toast.error("Failed to start payment process. Please try again.");
			}
		}, 1000);
	}, [contacts, skipTrace, searchValue, startTrial, resetActivationState]);

	// Handle activation API call (separate from payment flow)
	const handleActivation = useCallback(async () => {
		if (!paymentCompleted) {
			console.log("[ReactivateCampaign] Waiting for payment completion");
			return;
		}

		const workflowRequirements =
			searchValue.trim() || "Reactivate leads and follow up";

		// Update step function for activation
		const updateStep = (stepId: string, status: "processing" | "completed") => {
			setProcessingSteps((prev) =>
				prev.map((step) => (step.id === stepId ? { ...step, status } : step)),
			);
		};

		// Start activation step
		setTimeout(() => updateStep("activate", "processing"), 100);

		try {
			const response = await fetch("/api/campaigns/reactivate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contacts,
					skipTrace,
					workflowRequirements,
				}),
			});

			console.log("[ReactivateCampaign] API Response status:", response.status);

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ error: "Unknown error", message: "Network error" }));
				console.error("[ReactivateCampaign] API Error:", errorData);

				// Handle specific error cases
				if (response.status === 401) {
					throw new Error(
						errorData.message || "Please sign in to activate campaigns",
					);
				}

				throw new Error(
					errorData.message ||
						errorData.error ||
						`Failed to activate contacts (${response.status})`,
				);
			}

			const data = await response.json();
			console.log("[ReactivateCampaign] API Success:", data);

			// Update steps based on API response
			setTimeout(() => updateStep("activate", "completed"), 100);
			setTimeout(() => updateStep("calling", "processing"), 200);
			setTimeout(() => updateStep("calling", "completed"), 600);
			setTimeout(() => updateStep("texting", "processing"), 700);
			setTimeout(() => updateStep("texting", "completed"), 1100);
			setTimeout(() => updateStep("complete", "processing"), 1200);
			setTimeout(() => updateStep("complete", "completed"), 1500);

			const calculatedMetrics: BadgeMetrics = {
				dollarAmount: data.metrics?.dollarAmount || 0,
				timeSavedHours: data.metrics?.timeSavedHours || 0,
				contactsActivated: data.metrics?.contactsActivated || 0,
				hobbyTimeHours: data.metrics?.hobbyTimeHours || 0,
			};

			// Wait for animation to complete before showing metrics
			setTimeout(() => {
				setMetrics(calculatedMetrics);
				toast.success(
					`Successfully activated ${calculatedMetrics.contactsActivated} contacts!`,
				);

				// Call completion callback
				onActivationComplete?.(calculatedMetrics);

				// Build redirect URL to app.dealscale.io with tracking parameters
				const redirectUrl = new URL("https://app.dealscale.io");
				
				// Add user ID if available
				if (session?.user?.id) {
					redirectUrl.searchParams.append("userId", session.user.id);
				}
				
				// Add contacts count
				redirectUrl.searchParams.append("contactsCount", String(contacts.length));
				
				// Add payment intent ID if available from checkout state
				if (checkoutState?.clientSecret) {
					// Extract payment intent ID from client secret (format: "pi_xxx_secret_yyy")
					const paymentIntentId = checkoutState.clientSecret.split("_secret")[0];
					if (paymentIntentId) {
						redirectUrl.searchParams.append("paymentIntentId", paymentIntentId);
					}
				}
				
				// Add source identifier
				redirectUrl.searchParams.append("source", "homepage_hero");
				
				// Add activated contacts count from metrics
				if (calculatedMetrics.contactsActivated > 0) {
					redirectUrl.searchParams.append("activatedCount", String(calculatedMetrics.contactsActivated));
				}

				// Redirect to app.dealscale.io after a short delay
				setTimeout(() => {
					console.log("[ReactivateCampaign] Redirecting to app.dealscale.io with tracking:", redirectUrl.toString());
					window.location.href = redirectUrl.toString();
				}, 2000);
			}, 1600);
		} catch (error) {
			console.error("[ReactivateCampaign] Activation error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to activate contacts";
			toast.error(errorMessage);
		} finally {
			setIsProcessing(false);
		}
	}, [
		contacts,
		skipTrace,
		searchValue,
		onActivationComplete,
		paymentCompleted,
	]);

	// Trigger activation API call when payment completes
	useEffect(() => {
		if (paymentCompleted && isProcessing) {
			// Small delay to ensure state is updated
			const timer = setTimeout(() => {
				handleActivation();
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [paymentCompleted, isProcessing, handleActivation]);

	return (
		<div className={cn("mx-auto w-full max-w-4xl", className)}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full"
			>
				{/* Search/Upload Bar Container */}
				<div className="relative flex w-full flex-col gap-3 rounded-2xl border border-sky-500/30 bg-white/10 px-4 py-4 shadow-[0_8px_30px_rgba(59,130,246,0.2)] backdrop-blur-xl transition-all duration-300 focus-within:border-sky-400 focus-within:shadow-[0_8px_30px_rgba(59,130,246,0.4)] dark:border-sky-500/40 dark:bg-slate-800/30 dark:focus-within:border-sky-500 dark:focus-within:shadow-[0_8px_30px_rgba(59,130,246,0.3)] bg-white/80 dark:bg-white/10 border-sky-400/50 dark:border-sky-500/40">
					{/* Search Input */}
					<div className="relative flex flex-col gap-2">
						<div className="relative flex items-center gap-3">
							<Search className="h-5 w-5 shrink-0 text-sky-500 opacity-70 dark:text-sky-400" />
							<div className="relative flex-1">
								<Input
									ref={inputRef}
									type="text"
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !isProcessing) {
											handleActivate();
										}
									}}
									className="flex-1 border-0 bg-transparent text-base text-slate-900 placeholder:text-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white"
									disabled={isProcessing}
								/>
								{/* Animated Placeholder Overlay */}
								{!searchValue && !isFocused && (
									<div className="pointer-events-none absolute inset-0 flex items-center">
										<TypingAnimation
											words={PLACEHOLDER_OPTIONS}
											typeSpeed={80}
											deleteSpeed={40}
											pauseDelay={2000}
											loop={true}
											startOnView={false}
											showCursor={true}
											blinkCursor={true}
											cursorStyle="line"
											className="text-base text-slate-500 dark:text-slate-400"
											as="span"
										/>
									</div>
								)}
							</div>
							<Button
								type="button"
								onClick={handleActivate}
								disabled={isProcessing || contacts.length === 0}
								className="h-10 w-10 shrink-0 rounded-full bg-sky-500 p-0 text-white shadow-lg transition-all hover:bg-sky-600 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Activate campaign"
								title={
									contacts.length === 0
										? "Upload a file first"
										: "Activate campaign"
								}
							>
								{isProcessing ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<Play className="h-5 w-5" fill="currentColor" />
								)}
							</Button>
						</div>
						{/* Mobile-only hint */}
						<p className="text-xs text-slate-600 dark:text-white/60 sm:hidden">
							Upload your lead list
						</p>
					</div>

					{/* File Upload Section */}
					<div className="flex flex-col gap-3 border-slate-200/50 dark:border-white/10 border-t pt-3">
						<input
							ref={fileInputRef}
							type="file"
							accept=".csv,.xlsx,.xls"
							onChange={handleFileSelect}
							className="hidden"
							disabled={isProcessing}
						/>
						{/* File Upload Buttons Row with Enrich Toggle on same line when no file */}
						<div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${uploadedFile ? "flex-col sm:flex-row" : ""}`}>
							<div className="flex flex-wrap items-center gap-2 sm:gap-3">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => fileInputRef.current?.click()}
									disabled={isProcessing}
									className="shrink-0 border-slate-300/50 bg-slate-50/80 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
									title="Upload CSV/Excel"
									aria-label="Upload CSV/Excel"
								>
									<Upload className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">Upload CSV/Excel</span>
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleDownloadExample}
									disabled={isProcessing}
									className="shrink-0 border-slate-300/30 bg-slate-50/60 text-slate-600 hover:bg-slate-100 hover:text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
									title="Example CSV"
									aria-label="Example CSV"
								>
									<Download className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">Example CSV</span>
								</Button>
							</div>

							{uploadedFile && (
								<div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-slate-50/80 dark:bg-white/5 px-2 py-1.5 sm:px-3 sm:py-2">
									<FileIcon className="h-4 w-4 shrink-0 text-sky-500 dark:text-sky-400" />
									<span className="min-w-0 truncate text-xs text-slate-700 dark:text-white sm:text-sm">
										{uploadedFile.name}
									</span>
									{contacts.length > 0 && (
										<Badge variant="secondary" className="ml-auto shrink-0 sm:ml-2">
											{contacts.length} contacts
										</Badge>
									)}
									<button
										type="button"
										onClick={handleRemoveFile}
										disabled={isProcessing}
										className="ml-1 shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white sm:ml-2"
										aria-label="Remove file"
									>
										<X className="h-3 w-3" />
									</button>
								</div>
							)}

							{/* Enrich Toggle with Info - on same line when no file, new line when file uploaded */}
							<div className={`flex items-center gap-1.5 sm:gap-2 ${uploadedFile ? "w-full sm:w-auto sm:ml-auto" : "ml-auto"}`}>
							<Label
								htmlFor="enrich"
								className="flex cursor-pointer items-center gap-1 text-sm text-slate-700 dark:text-white/90 sm:gap-1.5"
							>
								<span className="hidden sm:inline">Enrich</span>
								{/* Mobile: Use Dialog, Desktop: Use Popover */}
								<>
									<button
										type="button"
										className="focus:outline-none sm:hidden"
										aria-label="Learn more about enrichment"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setShowEnrichInfo(true);
										}}
									>
										<Info className="h-4 w-4 text-sky-500 opacity-90 transition-opacity active:opacity-100 dark:text-sky-400" />
									</button>
									<Popover>
										<PopoverTrigger asChild>
											<button
												type="button"
												className="hidden focus:outline-none sm:block"
												aria-label="Learn more about enrichment"
											>
												<Info className="h-3.5 w-3.5 text-sky-500 opacity-80 transition-opacity hover:opacity-100 dark:text-sky-400" />
											</button>
										</PopoverTrigger>
										<PopoverContent
											className="z-50 w-80 border-sky-500/30 bg-background-dark text-white"
											side="top"
											align="end"
										>
											<div className="space-y-3">
												<div>
													<h4 className="mb-2 font-semibold text-base text-white">
														What is Enrichment?
													</h4>
													<p className="text-sm text-white/80 leading-relaxed">
														Automatically enhance your contact data with verified
														phone numbers, email addresses, and additional
														information to improve your outreach success rate.
													</p>
												</div>
												<div>
													<h5 className="mb-2 font-semibold text-sky-400 text-sm">
														What you get:
													</h5>
													<ul className="space-y-1.5 text-sm text-white/80">
														<li className="flex items-start gap-2">
															<span className="mt-0.5 text-sky-400">✓</span>
															<span>
																Verified contact information (phone, email)
															</span>
														</li>
														<li className="flex items-start gap-2">
															<span className="mt-0.5 text-sky-400">✓</span>
															<span>Enhanced lead data for better targeting</span>
														</li>
														<li className="flex items-start gap-2">
															<span className="mt-0.5 text-sky-400">✓</span>
															<span>
																Higher conversion rates with accurate contacts
															</span>
														</li>
														<li className="flex items-start gap-2">
															<span className="mt-0.5 text-sky-400">✓</span>
															<span>Time saved on manual data verification</span>
														</li>
													</ul>
												</div>
											</div>
										</PopoverContent>
									</Popover>
								</>
							</Label>
							<Switch
								id="enrich"
								checked={skipTrace}
								onCheckedChange={setSkipTrace}
								disabled={isProcessing}
								className="shrink-0 h-7 w-12 border-2 border-slate-300/50 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 data-[state=unchecked]:bg-slate-200/80 dark:border-slate-600/50 dark:data-[state=checked]:bg-sky-500 dark:data-[state=checked]:border-sky-500 dark:data-[state=unchecked]:bg-slate-700/80 [&>span]:h-6 [&>span]:w-6 [&>span]:shadow-md"
							/>
							</div>
						</div>
					</div>
				</div>

				{/* Processing Status Modal - Show during activation (after payment) */}
				<Dialog
					open={isProcessing && processingSteps.length > 0 && paymentCompleted}
				>
					<DialogContent className="border-sky-500/30 bg-slate-900/95 backdrop-blur-xl sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="text-white">
								Processing Campaign
							</DialogTitle>
							<DialogDescription className="text-white/70">
								Activating your contacts and setting up workflows
							</DialogDescription>
						</DialogHeader>
						<div className="mt-4">
							<ProcessingStatusList steps={processingSteps} />
						</div>
					</DialogContent>
				</Dialog>

				{/* Enrich Info Dialog for Mobile */}
				<Dialog open={showEnrichInfo} onOpenChange={setShowEnrichInfo}>
					<DialogContent className="border-sky-500/30 bg-slate-900/95 backdrop-blur-xl sm:max-w-md [&>button]:text-white [&>button]:hover:text-white/80 [&>button]:hover:bg-white/10">
						<DialogHeader>
							<DialogTitle className="text-white">
								Enrichment & AI Outreach
							</DialogTitle>
							<DialogDescription className="text-white/70">
								Learn about our data enrichment and AI automation features
							</DialogDescription>
						</DialogHeader>
						<Tabs defaultValue="enrichment" className="w-full">
							<TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
								<TabsTrigger value="enrichment" className="text-white data-[state=active]:bg-sky-500 data-[state=active]:text-white">
									Enrichment
								</TabsTrigger>
								<TabsTrigger value="ai-outreach" className="text-white data-[state=active]:bg-sky-500 data-[state=active]:text-white">
									AI Outreach
								</TabsTrigger>
							</TabsList>
							<TabsContent value="enrichment" className="space-y-3 pt-4">
								<div>
									<h4 className="mb-2 font-semibold text-base text-white">
										What is Enrichment?
									</h4>
									<p className="text-sm text-white/80 leading-relaxed">
										Automatically enhance your contact data with verified
										phone numbers, email addresses, and additional
										information to improve your outreach success rate.
									</p>
								</div>
								<div>
									<h5 className="mb-2 font-semibold text-sky-400 text-sm">
										What you get:
									</h5>
									<ul className="space-y-1.5 text-sm text-white/80">
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>
												Verified contact information (phone, email)
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>Enhanced lead data for better targeting</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>
												Higher conversion rates with accurate contacts
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>Time saved on manual data verification</span>
										</li>
									</ul>
								</div>
							</TabsContent>
							<TabsContent value="ai-outreach" className="space-y-3 pt-4">
								<div>
									<h4 className="mb-2 font-semibold text-base text-white">
										What is AI Outreach?
									</h4>
									<p className="text-sm text-white/80 leading-relaxed">
										AI Outreach is DealScale's intelligent automation system that handles your entire lead engagement workflow. It uses advanced AI to make calls, send personalized messages, and nurture leads automatically, so you can focus on closing deals instead of chasing contacts.
									</p>
								</div>
								<div>
									<h5 className="mb-2 font-semibold text-sky-400 text-sm">
										Key Features:
									</h5>
									<ul className="space-y-1.5 text-sm text-white/80">
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>
												AI-powered voice calls that sound natural and human
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>Automated SMS and email follow-up sequences</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>
												CRM integration that syncs every interaction automatically
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>24/7 lead nurturing that never sleeps</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 text-sky-400">✓</span>
											<span>Personalized messaging based on lead behavior and data</span>
										</li>
									</ul>
								</div>
							</TabsContent>
						</Tabs>
					</DialogContent>
				</Dialog>

				{/* Payment Modal */}
				{checkoutState && (
					<PricingCheckoutDialog
						clientSecret={checkoutState.clientSecret}
						plan={checkoutState.plan}
						planType={checkoutState.planType}
						mode={checkoutState.mode}
						context={checkoutState.context}
						postTrialAmount={checkoutState.postTrialAmount}
						onClose={() => {
							// Reset state if payment is cancelled
							resetActivationState();
							toast.info("Payment cancelled. Activation has been reset.");
						}}
						onSuccess={handlePaymentSuccess}
					/>
				)}

				{/* Badges Display - Show demo badges initially, then real metrics after activation */}
				{!isProcessing && (
					<AnimatePresence mode="wait">
						{metrics ? (
							<motion.div
								key="real-metrics"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.4 }}
							>
								<ReactivateCampaignBadges metrics={metrics} />
							</motion.div>
						) : (
							<motion.div
								key="demo-metrics"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<ReactivateCampaignBadges
									metrics={{
										dollarAmount: 12500,
										timeSavedHours: 100,
										contactsActivated: 50,
										hobbyTimeHours: 15,
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</motion.div>
		</div>
	);
}
