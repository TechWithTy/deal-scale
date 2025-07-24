import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface BlogHeroProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const BlogHero = ({ searchQuery, setSearchQuery }: BlogHeroProps) => {
	return (
		<section className="relative overflow-hidden bg-background-dark px-6 pt-24 pb-12 lg:px-8">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-grid-lines opacity-10" />
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-full max-h-3xl w-full max-w-3xl rounded-full bg-blue-pulse opacity-30 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
						CyberOni <span className="text-primary">Blog</span>
					</h1>
					<p className="mx-auto mb-8 max-w-3xl text-black text-lg md:text-xl dark:text-white/70">
						Latest insights, tutorials, and news on AI, software development,
						and digital transformation.
					</p>

					<div className="relative mx-auto max-w-2xl">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Search className="h-5 w-5 text-black dark:text-white/40" />
						</div>
						<input
							type="text"
							placeholder="Search articles..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pr-4 pl-10 text-black placeholder:text-black focus:border-primary focus:outline-none dark:text-white dark:text-white/40"
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default BlogHero;
