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

const MlsSearchDemo = () => {
	const [zipcode, setZipcode] = useState("");
	const [priceRange, setPriceRange] = useState<[number, number]>([
		300000, 900000,
	]);
	const [bedrooms, setBedrooms] = useState<number>(1);
	const [bathrooms, setBathrooms] = useState<number>(1);
	const [demoStage, setDemoStage] = useState<
		"initial" | "searching" | "results" | "video"
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
		return allProperties.filter(
			(property) =>
				property.price >= priceRange[0] &&
				property.price <= priceRange[1] &&
				property.bedrooms >= bedrooms &&
				property.bathrooms >= bathrooms &&
				(zipcode === "" || property.zipcode === zipcode),
		);
	}, [priceRange, bedrooms, bathrooms, zipcode]);

	const handleSearch = () => {
		setDemoStage("searching");
		setTimeout(() => {
			setDisplayedProperties(filteredProperties);
			setDemoStage("results");
			setTimeout(() => {
				setDemoStage("video");
			}, 2000); // Wait 2 seconds on results before showing video
		}, 1000); // Simulate 1-second search
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setDemoStage("initial");
	};

	const handleGetLeads = async () => {
		// Placeholder function for the modal's onGetLeads prop
		console.log("Get leads clicked!");
		return Promise.resolve();
	};

	useEffect(() => {
		if (demoStage === "video") {
			// todo: Adjust this timeout to match the length of your GIF
			const timer = setTimeout(() => {
				setIsModalOpen(true);
			}, 9000); // Show modal after 5 seconds

			return () => clearTimeout(timer);
		}
	}, [demoStage]);

	return (
		<>
			<div className=" overflow-y-auto p-4">
				{demoStage === "initial" && (
					<>
						<Header
							size="sm"
							title="Off Market Property Serch"
							subtitle="Find Off Market Leads In Those Areas"
						/>
						<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<div>
									<Label htmlFor="bedrooms">Min. Bedrooms</Label>
									<Input
										id="bedrooms"
										type="number"
										value={bedrooms}
										onChange={(e) => setBedrooms(Number(e.target.value))}
										min={1}
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="bathrooms">Min. Bathrooms</Label>
									<Input
										id="bathrooms"
										type="number"
										value={bathrooms}
										onChange={(e) => setBathrooms(Number(e.target.value))}
										min={1}
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="zipcode">Zipcode</Label>
									<Input
										id="zipcode"
										type="text"
										value={zipcode}
										onChange={(e) => setZipcode(e.target.value)}
										placeholder="e.g. 90210"
										className="mt-2"
									/>
								</div>
							</div>
							<div className="mt-4">
								<Label>
									Price Range: ${priceRange[0].toLocaleString()} - $
									{priceRange[1].toLocaleString()}
								</Label>
								<Slider
									min={300000}
									max={900000}
									step={10000}
									value={[priceRange[0], priceRange[1]]}
									onValueChange={(value) =>
										setPriceRange(value as [number, number])
									}
									className="mt-2"
								/>
							</div>
							<div className="mt-4 flex justify-center">
								<Button onClick={handleSearch} className="w-1/2">
									Search
								</Button>
							</div>
						</div>
					</>
				)}

				{demoStage === "searching" && (
					<div className="flex h-full flex-col items-center justify-center">
						<ClientLottie
							animationData={marketAnalysisAnimation}
							loop={true}
							className="h-32 w-32"
						/>
						<p className="mt-4 font-semibold text-lg">
							Finding Off Market Leads
						</p>
					</div>
				)}

				{demoStage === "results" && (
					<div className="h-[300px]">
						<MapComponent properties={displayedProperties} />
					</div>
				)}

				{demoStage === "video" && (
					<div className="flex h-full items-center justify-center">
						<img
							src="/demos/market_analysis.gif"
							alt="Deal Scale Agent in action"
							className="w-full rounded-lg"
						/>
					</div>
				)}

				{isModalOpen && (
					<CallCompleteModal
						isOpen={isModalOpen}
						onClose={handleCloseModal}
						title="Claim Your Leads"
						description="Get 5 free on-market leads or 1 off-market lead."
					/>
				)}
			</div>
		</>
	);
};

export default MlsSearchDemo;
