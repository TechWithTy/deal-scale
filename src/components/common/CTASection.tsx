"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SecondaryButtonConfig = {
	label: string;
	href: string;
	target?: string;
	rel?: string;
	variant?: "default" | "outline" | "secondary" | "ghost";
	className?: string;
};

type CTASectionProps = {
	title: string;
	description: string;
	buttonText?: string;
	href: string;
	className?: string;
	secondaryButton?: SecondaryButtonConfig;
};

export const CTASection = ({
	title,
	description,
	buttonText = "Get Started",
	href,
	className,
	secondaryButton,
}: CTASectionProps) => {
	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const secondaryRel =
		secondaryButton?.target === "_blank" && !secondaryButton.rel
			? "noopener noreferrer"
			: secondaryButton?.rel;

	return (
		<section
			className={cn(
				"glow relative border border-border/20 bg-background-dark/80 px-6 py-24 text-foreground backdrop-blur-sm lg:px-8",
				className,
			)}
		>
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
					<div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
						<Link href={href} className="inline-flex" prefetch={false}>
							<Button className="bg-gradient-to-r from-primary to-focus px-8 py-6 text-lg shadow-lg transition-opacity hover:opacity-90 hover:shadow-primary/20">
								{buttonText}
							</Button>
						</Link>
						{secondaryButton ? (
							<Link
								href={secondaryButton.href}
								target={secondaryButton.target}
								rel={secondaryRel}
								className="inline-flex"
								prefetch={false}
							>
								<Button
									variant={secondaryButton.variant ?? "outline"}
									className={cn(
										"px-8 py-6 text-lg",
										secondaryButton.className ??
											"border-primary/40 bg-background/80 text-primary hover:bg-primary/10",
									)}
								>
									{secondaryButton.label}
								</Button>
							</Link>
						) : null}
					</div>
				</motion.div>
			</div>
		</section>
	);
};
