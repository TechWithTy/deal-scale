import type { CaseStudy } from "@/types/case-study";
import { motion } from "framer-motion";
import { SectionHeading } from "../ui/section-heading";
import { ProblemSolutions } from "./ProblemSolutions";

interface BusinessOutcomeProps {
	caseStudy: CaseStudy;
}

export const CaseStudyBusinessOutcome = ({
	caseStudy,
}: BusinessOutcomeProps) => {
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
		<motion.div
			initial="hidden"
			animate="show"
			variants={container}
			className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
		>
			<div className="mx-auto max-w-5xl">
				<SectionHeading
					title="Business Outcomes"
					centered
					description=""
					className="mb-12"
				/>

				<ProblemSolutions caseStudy={caseStudy} />
			</div>
		</motion.div>
	);
};
