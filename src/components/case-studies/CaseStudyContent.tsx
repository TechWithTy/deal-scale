import { TechStackSection } from "@/components/common/TechStackSection";
import type { CaseStudy } from "@/types/case-study";
import { motion } from "framer-motion";
import { SectionHeading } from "../ui/section-heading";

interface CaseStudyContentProps {
	caseStudy: CaseStudy;
}

const CaseStudyContent = ({ caseStudy }: CaseStudyContentProps) => {
	// Animation variants for staggered elements
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	return (
		<section className="px-6 py-5 lg:px-8">
			<div className="mx-auto max-w-5xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<SectionHeading
						title="About the Study"
						centered
						description={`${caseStudy.clientName} - ${caseStudy.clientDescription}`}
						className="mb-6"
					/>
					<div className="glass-card rounded-xl p-8">
						<p className="text-black dark:text-white/80">
							{caseStudy.description}
						</p>
					</div>
				</motion.div>

				<div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
					<motion.div
						variants={container}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
					>
						<SectionHeading
							title="Business Challenges"
							centered
							description=""
							className="mb-12"
							size="small"
						/>
						<ul className="space-y-4">
							{caseStudy.businessChallenges.map((challenge, index) => (
								<motion.li
									key={challenge}
									variants={item}
									className="glass-card flex items-start rounded-lg p-4"
								>
									<div className="mt-0.5 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
										<span className="font-semibold text-primary text-sm">
											{index + 1}
										</span>
									</div>
									<p className="text-black dark:text-white/80">{challenge}</p>
								</motion.li>
							))}
						</ul>
					</motion.div>

					<motion.div
						variants={container}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
					>
						<SectionHeading
							title="Our Solutions"
							centered
							description=""
							className="mb-12"
							size="small"
						/>
						<ul className="space-y-4">
							{caseStudy.solutions.map((solution, index) => (
								<motion.li
									key={solution}
									variants={item}
									className="glass-card flex items-start rounded-lg p-4"
								>
									<div className="mt-0.5 mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
										<span className="font-semibold text-primary text-sm">
											{index + 1}
										</span>
									</div>
									<p className="text-black dark:text-white/80">{solution}</p>
								</motion.li>
							))}
						</ul>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default CaseStudyContent;
