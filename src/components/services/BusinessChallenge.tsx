"use client";
import { motion } from "framer-motion";
import type React from "react";
import { v4 as uuidv4 } from "uuid";

export type ServiceProblemSolution = {
	problem: string;
	solution: string;
};

interface BusinessChallengeProps {
	problemSolutions: ServiceProblemSolution[];
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
};

export const BusinessChallenge: React.FC<BusinessChallengeProps> = ({
	problemSolutions,
}) => {
	return (
		<div className="my-16 grid grid-cols-1 gap-12 md:grid-cols-2">
			{/* Business Challenges section */}
			<motion.div
				variants={container}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
			>
				<h2 className="mb-6 text-center font-bold text-2xl text-black md:text-3xl dark:text-white">
					Business Challenges
				</h2>
				<ul className="space-y-4">
					{problemSolutions.map((item, index) => (
						<motion.li
							key={uuidv4()}
							variants={itemVariants}
							className="glass-card flex items-start rounded-lg p-4"
						>
							<div className="mt-0.5 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
								<span className="font-semibold text-primary text-sm">
									{index + 1}
								</span>
							</div>
							<p className="text-black dark:text-white/80">{item.problem}</p>
						</motion.li>
					))}
				</ul>
			</motion.div>

			{/* Our Solutions section */}
			<motion.div
				variants={container}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
			>
				<h2 className="mb-6 text-center font-bold text-2xl text-black md:text-3xl dark:text-white">
					Our Solutions
				</h2>
				<ul className="space-y-4">
					{problemSolutions.map((item, index) => (
						<motion.li
							key={uuidv4()}
							variants={itemVariants}
							className="glass-card flex items-start rounded-lg p-4"
						>
							<div className="mt-0.5 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
								<span className="font-semibold text-primary text-sm">
									{index + 1}
								</span>
							</div>
							<p className="text-black dark:text-white/80">{item.solution}</p>
						</motion.li>
					))}
				</ul>
			</motion.div>
		</div>
	);
};
