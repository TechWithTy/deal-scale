import type { Project } from "@/types/projects";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";

export const ProjectCard: React.FC<{
	project: Project;
	setHoveredId: (id: number | null) => void;
}> = ({ project, setHoveredId }) => (
	<motion.div
		key={project.id}
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		viewport={{ once: true }}
		className="glass-card group overflow-hidden rounded-xl"
		onMouseEnter={() => setHoveredId(project.id)}
		onMouseLeave={() => setHoveredId(null)}
	>
		<div className="relative">
			{project.featured && (
				<div className="absolute top-4 left-4 z-10 rounded bg-primary/90 px-2 py-1 font-medium text-black text-xs dark:text-white">
					Featured Project
				</div>
			)}
			{project.liveUrl?.price && (
				<div className="absolute top-4 right-4 z-10 rounded bg-green-500/90 px-2 py-1 font-medium text-black text-xs dark:text-white">
					Paid Business Tool
				</div>
			)}
			{project.clientUrl && (
				<div className="absolute top-4 right-4 z-10 rounded bg-purple-500/90 px-2 py-1 font-medium text-black text-xs dark:text-white">
					Client Product
				</div>
			)}
			{!project.liveUrl?.price && !project.clientUrl && (
				<div className="absolute top-4 right-4 z-10 rounded bg-blue-500/90 px-2 py-1 font-medium text-black text-xs dark:text-white">
					Free Business Tool
				</div>
			)}

			<div className="h-56 overflow-hidden">
				<Image
					src={project.image}
					alt={project.title}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					fill
				/>
			</div>

			<div
				className={
					"absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 to-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				}
			>
				<div className="w-full p-6">
					<div className="mb-4 flex justify-center space-x-3">
						{project.github && (
							<Button
								size="sm"
								variant="outline"
								className="border-border bg-card text-card-foreground transition-colors hover:bg-primary/10"
								asChild
							>
								<a
									href={project.github}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="mr-1 h-4 w-4" />
									Try For Free
								</a>
							</Button>
						)}
						{project.liveUrl && (
							<Button
								size="sm"
								variant="outline"
								className="border-border bg-card text-card-foreground transition-colors hover:bg-primary/10"
								asChild
							>
								<a
									href={project.liveUrl.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="mr-1 h-4 w-4" />
									Starting At: ${project.liveUrl.price}
								</a>
							</Button>
						)}
						{project.clientUrl && (
							<Button
								size="sm"
								variant="outline"
								className="border-border bg-card text-card-foreground transition-colors hover:bg-primary/10"
								asChild
							>
								<a
									href={project.clientUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="mr-1 h-4 w-4" />
									View Live
								</a>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>

		<div className="p-6">
			<h3 className="mb-2 font-semibold text-xl transition-colors group-hover:text-primary">
				{project.title}
			</h3>
			<p className="mb-4 text-black text-sm dark:text-white/70">
				{project.description}
			</p>

			<div className="mb-4 flex flex-wrap gap-2">
				{project.technologies.map((tech) => (
					<span
						key={uuidv4()}
						className="rounded-full bg-white/5 px-2 py-1 text-black text-xs dark:text-white/70"
					>
						{tech}
					</span>
				))}
			</div>
		</div>
	</motion.div>
);
