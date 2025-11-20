"use client";

import { mockClosers } from "@/data/closers/mockClosers";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
								className="overflow-y-auto p-6"
								style={{ maxHeight: "calc(90vh - 140px)" }}
							>
								{/* Monetize Card */}
								<div
									className="mb-6 flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 text-center transition-all hover:border-blue-400 hover:shadow-lg dark:border-blue-600 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20"
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
									<div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-4xl">
										+
									</div>
									<h3 className="mb-2 font-bold text-slate-900 text-xl dark:text-white">
										Apply to Become a Closer
									</h3>
									<p className="max-w-md text-slate-600 text-sm dark:text-slate-300">
										Join our marketplace of professional real estate closers.
										Share your expertise and earn revenue by helping others close
										deals remotely.
									</p>
								</div>

								{/* Closers Grid */}
								<div className="mb-4">
									<h3 className="mb-4 font-semibold text-slate-900 text-lg dark:text-white">
										Featured Closers
									</h3>
									<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
										{mockClosers.map((closer) => (
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
												onClick={() =>
													setSelectedCloser(
														selectedCloser === closer.id ? null : closer.id,
													)
												}
											>
												{/* Closer Image */}
												<div className="mb-4 flex items-center gap-4">
													<div className="relative h-16 w-16 overflow-hidden rounded-full">
														<Image
															src={closer.image}
															alt={closer.name}
															fill
															className="object-cover"
															sizes="64px"
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

												{/* Rate */}
												<div className="flex items-center justify-between">
													<span className="font-semibold text-slate-900 text-base dark:text-white">
														${closer.hourlyRate}/hr
													</span>
													{selectedCloser === closer.id && (
														<CheckCircle2 className="h-5 w-5 text-blue-600" />
													)}
												</div>
											</motion.div>
										))}
									</div>
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

