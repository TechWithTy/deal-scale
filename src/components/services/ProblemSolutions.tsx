// components/ProblemSolutionSection.tsx
import type React from "react";
import { v4 as uuidv4 } from "uuid";
import { SectionHeading } from "../ui/section-heading";

interface ProblemSolutionItem {
	problem: string;
	solution: string;
}

interface Props {
	items: ProblemSolutionItem[];
}

const ProblemSolutionSection: React.FC<Props> = ({ items }) => {
	return (
		<section className="container">
			<div className="grid gap-8 md:grid-cols-2">
				<SectionHeading title="Problems" />
				<SectionHeading title="Solutions" />
			</div>

			<div className="mt-8 space-y-8">
				{items?.map((item, index) => (
					<div key={uuidv4()} className="grid gap-8 md:grid-cols-2">
						{/* Problem Card */}
						<div className="rounded-lg border border-primary bg-background-dark p-6 transition-shadow duration-300 hover:shadow-lg">
							<div className="flex items-center gap-3">
								<div className="font-bold text-2xl text-primary">
									0{index + 1}
								</div>
								<h3 className="font-bold text-primary text-xl">
									{item.problem}
								</h3>
							</div>
						</div>

						{/* Solution Card */}
						<div className="rounded-lg border border-focus bg-background-dark p-6 transition-shadow duration-300 hover:shadow-lg">
							<div className="flex items-center gap-3">
								<div className="font-bold text-2xl text-focus">
									0{index + 1}
								</div>
								<h3 className="font-bold text-focustext-xl">{item.solution}</h3>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default ProblemSolutionSection;
