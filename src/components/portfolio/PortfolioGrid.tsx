// In src/components/portfolio/PortfolioGrid.tsx
"use client";

import { useCategoryContext } from "@/contexts/CategoryContext"; // Updated import
import type { Project } from "@/types/projects";
import { useState } from "react";
import React, { Suspense } from "react";
const ProjectCard = React.lazy(() =>
	import("./ProjectCard").then((mod) => ({ default: mod.ProjectCard })),
);

const PortfolioGrid = ({ projects = [] }: { projects?: Project[] }) => {
	const { activeCategory } = useCategoryContext(); // Updated context usage
	const [hoveredId, setHoveredId] = useState<number | null>(null);

	const filteredProjects =
		activeCategory === "all"
			? projects
			: projects.filter((project) => project.category === activeCategory);

	return (
		<Suspense fallback={<div>Loading projects...</div>}>
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{filteredProjects.map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
						setHoveredId={setHoveredId}
					/>
				))}
			</div>
		</Suspense>
	);
};

export default PortfolioGrid;
