import { SectionHeading } from "@/components/ui/section-heading";
import type { CaseStudy } from "@/types/case-study";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
interface RelatedCaseStudiesProps {
	studies: CaseStudy[];
}

const RelatedCaseStudies = ({ studies }: RelatedCaseStudiesProps) => {
	if (studies.length === 0) return null;

	return (
		<section className="px-6 py-20 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<SectionHeading
					title="Related Case Studies"
					description="See real success stories and ways to leverage Deal Scale to grow 
your business."
					centered={true}
				/>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{studies.map((study, index) => (
						<motion.div
							key={study.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="glass-card group hover:-translate-y-2 overflow-hidden rounded-xl transition-all duration-300"
						>
							<Link href={`/case-studies/${study.slug}`}>
								<div className="h-40 overflow-hidden">
									<Image
										src={study.thumbnailImage}
										alt={study.title}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										fill
									/>
								</div>

								<div className="p-6">
									<h3 className="mb-2 font-semibold text-lg transition-colors group-hover:text-primary">
										{study.title}
									</h3>

									<p className="mb-4 line-clamp-2 text-black text-sm dark:text-white/70">
										{study.subtitle}
									</p>

									<span className="inline-flex items-center text-primary text-sm transition-colors hover:text-tertiary">
										View Case Study <ChevronRight className="ml-1 h-4 w-4" />
									</span>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default RelatedCaseStudies;
