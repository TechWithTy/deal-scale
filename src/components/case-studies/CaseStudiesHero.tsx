import { motion } from "framer-motion";
import Header from "../common/Header";

const CaseStudiesHero = () => {
	return (
		<section
			className="relative overflow-hidden bg-background-dark px-4 pt-24 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
			aria-labelledby="case-studies-hero-title"
		>
			{/* Decorative background */}
			<div
				className="pointer-events-none absolute inset-0 select-none overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute inset-0 bg-grid-lines opacity-10" />
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-full max-h-3xl w-full max-w-3xl rounded-full bg-blue-pulse opacity-30 blur-3xl" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					{/* Visually distinct, accessible heading */}
					<Header
						title="Case Studies"
						subtitle="See how we've helped businesses solve complex challenges and achieve exceptional results through innovative technology solutions."
						size="lg" // or "sm", "md", "xl"
						className="mb-10" // optional additional classes
					/>
				</motion.div>
			</div>
		</section>
	);
};

export default CaseStudiesHero;
