import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { CaseStudy } from "@/types/case-study";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface CaseStudyDetailHeaderProps {
	caseStudy: CaseStudy;
}

const CaseStudyDetailHeader = ({ caseStudy }: CaseStudyDetailHeaderProps) => {
	const hasMounted = useHasMounted();

	if (!hasMounted) return null;

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		toast.success("You can now share this case study with others");
	};

	return (
		<section className="relative overflow-hidden bg-background-dark px-4 pt-20 pb-16 sm:px-6 lg:px-8">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-grid-lines opacity-10" />
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-full max-h-4xl w-full max-w-4xl rounded-full bg-blue-pulse opacity-20 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl">
				<div className="mb-10 text-center sm:text-left">
					<Link
						href="/case-studies"
						className="inline-flex items-center text-black transition-colors hover:text-black dark:text-white dark:text-white/70"
					>
						<ChevronLeft className="mr-1 h-4 w-4" /> Back to Case Studies
					</Link>
				</div>

				<div className="flex flex-col items-center gap-12 lg:flex-row">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="w-full text-center sm:text-left lg:w-1/2"
					>
						<div className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start">
							{caseStudy.categories.map((category) => (
								<span
									key={uuidv4()}
									className="rounded-full bg-primary/20 px-3 py-1 font-medium text-primary text-xs"
								>
									{category.charAt(0).toUpperCase() + category.slice(1)}
								</span>
							))}
							{caseStudy.featured && (
								<span className="rounded-full bg-white/10 px-3 py-1 font-medium text-black text-xs dark:text-white/80">
									Featured
								</span>
							)}
						</div>

						<h1 className="mb-4 font-bold text-3xl md:text-4xl lg:text-5xl">
							{caseStudy.title}
						</h1>

						<p className="mb-8 text-black text-xl dark:text-white/80">
							{caseStudy.subtitle}
						</p>

						<div className="mb-6 flex flex-wrap justify-center gap-2 sm:justify-start">
							{caseStudy.tags.map((tag, index) => (
								<span
									key={uuidv4()}
									className="rounded-full bg-white/5 px-3 py-1 text-black text-sm dark:text-white/70"
								>
									{tag}
								</span>
							))}
						</div>
						<div className="flex justify-center gap-4 sm:justify-start">
							<Button
								variant="default"
								size="sm"
								onClick={handleShare}
								className="border border-primary/80 bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Share className="mr-2 h-4 w-4" /> Share
							</Button>
							{caseStudy.referenceLink && (
								<Link
									href={caseStudy.referenceLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block"
								>
									<Button
										variant="outline"
										size="sm"
										className="border-input text-primary hover:bg-primary/10"
									>
										<Eye className="mr-2 h-4 w-4" /> View Case Study
									</Button>
								</Link>
							)}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="w-full lg:w-1/2"
					>
						<div className="overflow-hidden rounded-xl shadow-2xl">
							<Image
								src={caseStudy.featuredImage}
								alt={caseStudy.title}
								className="h-auto w-full"
								width={1200}
								height={630}
							/>
						</div>
					</motion.div>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
					{caseStudy.results.map((result, index) => (
						<motion.div
							key={uuidv4()}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
							className="glass-card rounded-xl p-6 text-center"
						>
							<h3 className="mb-2 font-bold text-4xl text-primary">
								{result.value}
							</h3>
							<p className="text-black dark:text-white/70">{result.title}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default CaseStudyDetailHeader;
