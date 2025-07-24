import loadingAnimation from "@/assets/animations/launchLoading.json";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function LoadingAnimation() {
	const [currentText, setCurrentText] = useState("Loading");
	const texts = ["Loading", "Building", "Launching"];
	const letterVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: (i = 1) => ({
			opacity: 1,
			transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
		}),
	};

	useEffect(() => {
		let index = 0;
		const interval = setInterval(() => {
			index = (index + 1) % texts.length;
			setCurrentText(texts[index]);
		}, 3000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-[#9013fe] to-[#64c5a7]">
			<div className="h-48 w-48 md:h-96 md:w-96">
				<Lottie
					animationData={loadingAnimation}
					loop={true}
					style={{ width: "100%", height: "100%" }}
				/>
			</div>
			<motion.div
				key={currentText}
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="mt-4 font-bold text-4xl text-black md:text-6xl dark:text-white"
			>
				{currentText.split("").map((letter, index) => (
					<motion.span key={uuidv4()} variants={letterVariants}>
						{letter}
					</motion.span>
				))}
				<motion.span variants={letterVariants}>...</motion.span>
			</motion.div>
		</div>
	);
}
