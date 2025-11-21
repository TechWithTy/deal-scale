"use client";

import { mockClosers, type CloserProfile } from "@/data/closers/mockClosers";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, CheckCircle2, ChevronLeft, ChevronRight, Percent, MessageSquare, UserPlus, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface ClosersMarketplaceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onApplyClick?: () => void;
}

const ClosersMarketplaceModal = ({
	isOpen,
	onClose,
	onApplyClick,
}: ClosersMarketplaceModalProps) => {
	const [selectedCloser, setSelectedCloser] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"featured" | "all">("featured");
	const [isLoading, setIsLoading] = useState(false);

	// Get featured closers (top 6 by rating/deals closed)
	const featuredClosers = useMemo(() => {
		return [...mockClosers]
			.sort((a, b) => {
				if (b.rating !== a.rating) {
					return b.rating - a.rating;
				}
				return b.dealsClosed - a.dealsClosed;
			})
			.slice(0, 6);
	}, []);

	// Get closers based on view mode
	const displayedClosers = useMemo(() => {
		return viewMode === "featured" ? featuredClosers : mockClosers;
	}, [viewMode, featuredClosers]);

	// Pagination for closers grid (6 per page for optimal UX)
	const {
		pagedItems: paginatedClosers,
		page,
		totalPages,
		nextPage,
		prevPage,
		setPage,
		canShowPagination,
	} = usePagination(displayedClosers, {
		itemsPerPage: 6,
		initialPage: 1,
		enableShowAll: false,
	});

	// Debug: Log when modal opens and closers count
	React.useEffect(() => {
		if (isOpen) {
			console.log("[ClosersMarketplaceModal] Modal opened, closers count:", mockClosers.length);
		}
	}, [isOpen]);

	// Reset to first page when modal opens or view mode changes
	React.useEffect(() => {
		if (isOpen) {
			setPage(1);
		}
	}, [isOpen, viewMode, setPage]);

	// Handle hire closer
	const handleHireCloser = useCallback((closer: CloserProfile, event?: React.MouseEvent) => {
		event?.stopPropagation(); // Prevent card selection
		setIsLoading(true);
		// TODO: Open booking/hiring modal or redirect to booking page
		setTimeout(() => {
			toast.success(`Hiring ${closer.name}...`);
			setIsLoading(false);
			console.log("Hire closer:", closer.id);
		}, 300);
	}, []);

	// Handle contact closer
	const handleContactCloser = useCallback((closer: CloserProfile, event?: React.MouseEvent) => {
		event?.stopPropagation(); // Prevent card selection
		setIsLoading(true);
		// TODO: Open messaging modal or redirect to messaging page
		setTimeout(() => {
			toast.success(`Messaging ${closer.name}...`);
			setIsLoading(false);
			console.log("Contact closer:", closer.id);
		}, 300);
	}, []);

	const handleApplyAsCloser = () => {
		if (onApplyClick) {
			onApplyClick();
		} else {
			window.location.href = "/closers/apply";
		}
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
					>
						<div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
							{/* Header */}
							<div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 dark:border-slate-800">
								<div>
									<h2 className="font-bold text-white text-2xl">
										Remote Closers Marketplace
									</h2>
									<p className="mt-1 text-blue-100 text-sm">
										Connect with professional closers or apply to become one
									</p>
								</div>
								<button
									onClick={onClose}
									className="rounded-lg p-2 text-white transition-colors hover:bg-white/20"
									aria-label="Close modal"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							{/* Content */}
							<div
								className="overflow-y-auto p-6 scroll-smooth"
								style={{ 
									maxHeight: "calc(90vh - 140px)",
									scrollBehavior: "smooth",
									scrollPaddingTop: "24px",
								}}
							>
								{/* Monetize Card */}
								<div
									className="mb-6 flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 text-center transition-all hover:border-blue-400 hover:shadow-lg dark:border-blue-600 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20"
									onClick={handleApplyAsCloser}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleApplyAsCloser();
										}
									}}
								>
									<div className="mb-3 flex gap-2">
										<span className="rounded-full bg-blue-600 px-3 py-1 text-white text-xs font-semibold">
											Browse {mockClosers.length} Closers
										</span>
										<span className="rounded-full bg-indigo-600 px-3 py-1 text-white text-xs font-semibold">
											Apply to Join
										</span>
									</div>
									<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-3xl">
										+
									</div>
									<h3 className="mb-1 font-bold text-slate-900 text-lg dark:text-white">
										Apply to Become a Closer
									</h3>
									<p className="max-w-md text-slate-600 text-xs dark:text-slate-300">
										Join the marketplace and earn revenue remotely.
									</p>
								</div>

								{/* Closers Grid */}
								<div className="mb-4">
									<div className="mb-4 flex items-center justify-between">
										<h3 className="font-semibold text-slate-900 text-lg dark:text-white">
											{viewMode === "featured" 
												? `Featured Closers (${featuredClosers.length})`
												: `All Closers (${mockClosers.length})`}
										</h3>
										<Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "featured" | "all")}>
											<TabsList className="h-8">
												<TabsTrigger value="featured" className="text-xs px-3 py-1">
													Featured
												</TabsTrigger>
												<TabsTrigger value="all" className="text-xs px-3 py-1">
													All
												</TabsTrigger>
											</TabsList>
										</Tabs>
									</div>
									{!displayedClosers || displayedClosers.length === 0 ? (
										<p className="rounded-lg bg-yellow-50 p-4 text-yellow-800 text-center text-sm dark:bg-yellow-900/20 dark:text-yellow-400">
											⚠️ No closers available at this time. Check console for errors.
										</p>
									) : (
										<>
											<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
												{paginatedClosers.map((closer) => (
											<motion.div
												key={closer.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.1 }}
												className={cn(
													"group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-800",
													selectedCloser === closer.id &&
														"border-blue-500 ring-2 ring-blue-500",
												)}
											>
												{/* Closer Image */}
												<div className="mb-4 flex items-center gap-4">
													<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
														<Image
															src={closer.image}
															alt={closer.name}
															fill
															className="object-cover"
															sizes="64px"
															onError={(e) => {
																console.error("[ClosersMarketplaceModal] Image failed to load:", closer.image);
																(e.target as HTMLImageElement).src = "https://via.placeholder.com/64x64?text=" + closer.name.charAt(0);
															}}
														/>
													</div>
													<div className="flex-1">
														<h4 className="font-semibold text-slate-900 text-base dark:text-white">
															{closer.name}
														</h4>
														<p className="text-slate-600 text-xs dark:text-slate-400">
															{closer.title}
														</p>
													</div>
												</div>

												{/* Rating & Stats */}
												<div className="mb-3 flex items-center gap-2">
													<div className="flex items-center gap-1">
														<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
														<span className="font-semibold text-slate-900 text-sm dark:text-white">
															{closer.rating}
														</span>
													</div>
													<span className="text-slate-500 text-xs dark:text-slate-400">
														({closer.reviews} reviews)
													</span>
													<span className="text-slate-300 dark:text-slate-600">
														•
													</span>
													<span className="text-slate-500 text-xs dark:text-slate-400">
														{closer.dealsClosed} deals closed
													</span>
												</div>

												{/* Location */}
												<div className="mb-3 flex items-center gap-1.5 text-slate-600 text-xs dark:text-slate-400">
													<MapPin className="h-3.5 w-3.5" />
													{closer.location}
												</div>

												{/* Bio */}
												<p className="mb-3 line-clamp-2 text-slate-600 text-xs dark:text-slate-400">
													{closer.bio}
												</p>

												{/* Specialties */}
												<div className="mb-3 flex flex-wrap gap-1.5">
													{closer.specialties.slice(0, 2).map((specialty) => (
														<span
															key={specialty}
															className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300"
														>
															{specialty}
														</span>
													))}
													{closer.specialties.length > 2 && (
														<span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 text-xs dark:bg-slate-700 dark:text-slate-400">
															+{closer.specialties.length - 2}
														</span>
													)}
												</div>

												{/* Rate & Commission */}
												<div className="mb-3 space-y-2">
													<div className="flex items-center justify-between">
														<span className="font-semibold text-slate-900 text-base dark:text-white">
															${closer.hourlyRate}/hr
														</span>
													</div>
													
													{/* Commission Percentage */}
													{closer.commissionPercentage && (
														<div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-blue-700 text-xs dark:bg-blue-900/20 dark:text-blue-300">
															<Percent className="h-3 w-3" />
															<span className="font-medium">
																{closer.commissionPercentage}% commission on deals
															</span>
														</div>
													)}

													{/* SaaS Split */}
													{closer.saasSplit && (
														<div className="rounded-md bg-slate-100 p-2 dark:bg-slate-700/50">
															<div className="flex items-center justify-between text-slate-700 text-xs dark:text-slate-300">
																<span>Platform Fee:</span>
																<span className="font-semibold">{closer.saasSplit.platformFee}%</span>
															</div>
															<div className="mt-1 flex items-center justify-between text-slate-700 text-xs dark:text-slate-300">
																<span>You Keep:</span>
																<span className="font-semibold text-green-600 dark:text-green-400">
																	{closer.saasSplit.closerFee}%
																</span>
															</div>
														</div>
													)}
												</div>

												{/* Action Buttons */}
												<div className="mt-4 flex gap-2">
													<button
														type="button"
														onClick={(e) => handleContactCloser(closer, e)}
														disabled={isLoading}
														className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 text-xs transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
													>
														{isLoading ? (
															<Loader2 className="h-3 w-3 animate-spin" />
														) : (
															<MessageSquare className="h-3 w-3" />
														)}
														<span>Contact</span>
													</button>
													<button
														type="button"
														onClick={(e) => handleHireCloser(closer, e)}
														disabled={isLoading}
														className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 font-medium text-white text-xs transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
													>
														{isLoading ? (
															<Loader2 className="h-3 w-3 animate-spin" />
														) : (
															<UserPlus className="h-3 w-3" />
														)}
														<span>Hire</span>
													</button>
												</div>
											</motion.div>
										))}
										</div>

										{/* Pagination Controls */}
										{canShowPagination && (
											<div className="mt-6 flex items-center justify-center gap-4">
												<button
													onClick={prevPage}
													disabled={page === 1}
													className={cn(
														"flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
														page === 1 && "opacity-50 cursor-not-allowed"
													)}
													aria-label="Previous page"
												>
													<ChevronLeft className="h-4 w-4" />
													Previous
												</button>
												<div className="flex items-center gap-2">
													<span className="text-slate-600 text-sm dark:text-slate-400">
														Page {page} of {totalPages}
													</span>
												</div>
												<button
													onClick={nextPage}
													disabled={page === totalPages}
													className={cn(
														"flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
														page === totalPages && "opacity-50 cursor-not-allowed"
													)}
													aria-label="Next page"
												>
													Next
													<ChevronRight className="h-4 w-4" />
												</button>
											</div>
										)}
									</>
									)}
								</div>
							</div>

							{/* Footer */}
							<div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
								<div className="flex items-center justify-between">
									<p className="text-slate-600 text-sm dark:text-slate-400">
										{selectedCloser
											? `Selected: ${mockClosers.find((c) => c.id === selectedCloser)?.name}`
											: "Select a closer to book their services"}
									</p>
									<div className="flex gap-3">
										<button
											onClick={onClose}
											className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
										>
											Close
										</button>
										{selectedCloser && (
											<button
												onClick={() => {
													// Handle booking logic here
													console.log("Booking closer:", selectedCloser);
												}}
												className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white text-sm transition-colors hover:bg-blue-700"
											>
												Book Closer
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default ClosersMarketplaceModal;

