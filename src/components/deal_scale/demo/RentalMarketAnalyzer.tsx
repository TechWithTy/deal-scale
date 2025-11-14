"use client";

import marketAnalysisAnimation from "@/assets/animations/market_analysis.json";
import Header from "@/components/common/Header";
import { CallCompleteModal } from "@/components/deal_scale/talkingCards/session/CallCompleteModal";
import ClientLottie from "@/components/ui/ClientLottie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { properties as allProperties } from "@/data/mlsProperties";
import type { Property } from "@/data/mlsProperties";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const RentalMarketAnalyzer = () => {
	const [zipcode, setZipcode] = useState("");
	const [rentRange, setRentRange] = useState<[number, number]>([1500, 5000]);
	const [bedrooms, setBedrooms] = useState<number>(1);
	const [bathrooms, setBathrooms] = useState<number>(1);
	const [demoStage, setDemoStage] = useState<
		"initial" | "analyzing" | "results" | "video"
	>("initial");
	const [displayedProperties, setDisplayedProperties] = useState<Property[]>(
		[],
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const MapComponent = useMemo(
		() =>
			dynamic(() => import("./Map"), {
				ssr: false,
				loading: () => <p>Loading map...</p>,
			}),
		[],
	);

	const filteredProperties = useMemo(() => {
		return allProperties
			.filter(
				(property) =>
					(property.rent ?? property.price) >= rentRange[0] &&
					(property.rent ?? property.price) <= rentRange[1] &&
					property.bedrooms >= bedrooms &&
					property.bathrooms >= bathrooms &&
					(zipcode === "" || property.zipcode === zipcode),
			)
			.map((p) => ({
				...p,
				rent: p.rent ?? Math.round((p.price ?? 0) * 0.007), // fallback estimate
			}));
	}, [rentRange, bedrooms, bathrooms, zipcode]);

	const handleAnalyze = () => {
		setDemoStage("analyzing");
		setTimeout(() => {
			setDisplayedProperties(filteredProperties);
			setDemoStage("results");
			setTimeout(() => {
				setDemoStage("video");
			}, 3000);
		}, 1200);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setDemoStage("initial");
	};

	const handleGetLeads = async () => {
		console.log("Get rental leads clicked!");
		return Promise.resolve();
	};

	useEffect(() => {
		if (demoStage === "video") {
			const timer = setTimeout(() => {
				setIsModalOpen(true);
			}, 15000);
			return () => clearTimeout(timer);
		}
	}, [demoStage]);

	return (
		<div className="overflow-y-auto p-4">
			{demoStage === "initial" && (
				<>
					<Header
						size="sm"
						title="Estimate Property Value"
						subtitle="Find High-Demand Rental Areas & Estimate Property Value"
					/>
					<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
						<div className="flex flex-col gap-4">
							<div>
								<Label htmlFor="zipcodes">
									Zip Codes{" "}
									<span className="text-gray-500 text-xs">
										(comma separated for multiple areas)
									</span>
								</Label>
								<Input
									id="zipcodes"
									type="text"
									value={zipcode}
									onChange={(e) => setZipcode(e.target.value)}
									placeholder="e.g. 94110, 94117"
									className="mt-2"
								/>
								<p className="mt-1 text-gray-500 text-xs">
									Analyze rental markets in one or more zip codes.
								</p>
							</div>
							<div>
								<Label htmlFor="address">
									Address{" "}
									<span className="text-gray-500 text-xs">(optional)</span>
								</Label>
								<Input
									id="address"
									type="text"
									placeholder="e.g. 123 Main St, San Francisco, CA"
									className="mt-2"
									// Optionally add a state if needed for address
									// value={address}
									// onChange={(e) => setAddress(e.target.value)}
								/>
								<p className="mt-1 text-gray-500 text-xs">
									Estimate property value for a specific address.
								</p>
							</div>
						</div>

						<div className="mt-4 flex justify-center">
							<Button onClick={handleAnalyze} className="w-1/2">
								Analyze Market
							</Button>
						</div>
					</div>
				</>
			)}

			{demoStage === "analyzing" && (
				<div className="flex h-full flex-col items-center justify-center">
					<ClientLottie
						animationData={marketAnalysisAnimation}
						loop={true}
						className="h-32 w-32"
					/>
					<p className="mt-4 font-semibold text-lg">Analyzing Rental Market</p>
				</div>
			)}

			{demoStage === "results" && (
				<div className="h-[300px]">
					<MapComponent properties={displayedProperties} />
					<div className="mt-4">
						<h3 className="mb-2 font-bold text-lg">Sample Listings</h3>
						<ul className="divide-y divide-gray-200 dark:divide-gray-700">
							{displayedProperties.slice(0, 3).map((property) => (
								<li key={property.id} className="py-2">
									<span className="font-semibold">{property.address}</span>,{" "}
									{property.zipcode} —{" "}
									<span>${property.rent?.toLocaleString() ?? "-"}</span> / mo •{" "}
									{property.bedrooms}bd/{property.bathrooms}ba
								</li>
							))}
							{displayedProperties.length === 0 && (
								<li className="py-2 text-gray-500">No matches found.</li>
							)}
						</ul>
					</div>
				</div>
			)}

			{demoStage === "video" && (
				<div className="flex h-full items-center justify-center">
					<img
						src="/demos/rental_analysis.gif"
						alt="Rental Market Analyzer in action"
						className="w-full rounded-lg"
					/>
				</div>
			)}

			{isModalOpen && (
				<CallCompleteModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					title="Claim Your Rental Leads"
					description="Get 5 free high-demand rental comps or 1 premium rent estimate."
				/>
			)}
		</div>
	);
};

export default RentalMarketAnalyzer;
