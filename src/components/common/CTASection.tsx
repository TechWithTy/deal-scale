"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const CTASection = ({
	title,
	description,
	buttonText = "Get Started",
	href,
	className,
}: {
	title: string;
	description: string;
	buttonText?: string;
	href: string;
	className?: string;
}) => {
	const router = useRouter();

	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const handleClick = () => {
		router.push(href);
	};

	return (
		<section className="glow relative border border-border/20 bg-background-dark/80 px-6 py-24 text-foreground backdrop-blur-sm lg:px-8">
			<div className="relative z-10 mx-auto max-w-4xl text-center">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={fadeIn}
				>
					<h2 className="mb-6 font-bold text-3xl text-black md:text-4xl dark:text-white">
						{title}
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-black text-lg dark:text-white/60">
						{description}
					</p>
					<Button
						className="bg-gradient-to-r from-primary to-focus px-8 py-6 text-lg shadow-lg transition-opacity hover:opacity-90 hover:shadow-primary/20"
						onClick={handleClick}
					>
						{buttonText}
					</Button>
				</motion.div>
			</div>
		</section>
	);
};
