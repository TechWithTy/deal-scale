import type { BentoFeature } from "@/types/bento/features";
import {
	Award,
	Clock,
	Code,
	Rocket,
	ShieldCheck,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";

export const CyberoniCaseStudyFeatures: BentoFeature[] = [
	{
		title: "Unparalleled Cybersecurity",
		icon: <ShieldCheck className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					Fortified Digital Defense
				</h3>
				<p className="flex-grow text-accent text-sm">
					Our advanced security protocols and AI-driven threat detection systems
					provide ironclad protection for your digital assets.
				</p>
				<div className="mt-4 flex items-center">
					<ShieldCheck className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">
						99.9% Threat Prevention Rate
					</span>
				</div>
			</div>
		),
	},
	{
		title: "Cutting-Edge Technology",
		icon: <Zap className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					Innovation at the Forefront
				</h3>
				<p className="flex-grow text-accent text-sm">
					We leverage the latest in AI, machine learning, and quantum computing
					to keep you ahead of the technological curve.
				</p>
				<div className="mt-4 flex items-center">
					<Zap className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">
						3x Faster Solution Delivery
					</span>
				</div>
			</div>
		),
	},
	{
		title: "Expert Team",
		icon: <Users className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					World-Class Talent
				</h3>
				<p className="flex-grow text-accent text-sm">
					Our team of industry veterans and innovative minds ensures top-tier
					solutions tailored to your unique challenges.
				</p>
				<div className="mt-4 flex items-center">
					<Users className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">
						150+ Years Combined Experience
					</span>
				</div>
			</div>
		),
	},
	{
		title: "Scalable Solutions",
		icon: <TrendingUp className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					Growth-Ready Architecture
				</h3>
				<p className="flex-grow text-accent text-sm">
					Our scalable infrastructures and flexible systems grow with your
					business, from startup to enterprise.
				</p>
				<div className="mt-4 flex items-center">
					<TrendingUp className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">
						10,000x Scaling Capacity
					</span>
				</div>
			</div>
		),
	},
	{
		title: "Custom Development",
		icon: <Code className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					Tailored Tech Solutions
				</h3>
				<p className="flex-grow text-accent text-sm">
					We craft bespoke software solutions that align perfectly with your
					business objectives and operational needs.
				</p>
				<div className="mt-4 flex items-center">
					<Code className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">
						100% Client Satisfaction Rate
					</span>
				</div>
			</div>
		),
	},
	{
		title: "Rapid Deployment",
		icon: <Rocket className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-yellow-600/20 to-amber-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					Swift Time-to-Market
				</h3>
				<p className="flex-grow text-accent text-sm">
					Our agile methodologies and efficient processes ensure rapid
					development and deployment of your solutions.
				</p>
				<div className="mt-4 flex items-center">
					<Rocket className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">
						40% Faster Project Completion
					</span>
				</div>
			</div>
		),
	},
	{
		title: "24/7 Support",
		icon: <Clock className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					Round-the-Clock Assistance
				</h3>
				<p className="flex-grow text-accent text-sm">
					Our dedicated support team is always available to ensure your systems
					run smoothly and issues are resolved promptly.
				</p>
				<div className="mt-4 flex items-center">
					<Clock className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">
						15-Minute Average Response Time
					</span>
				</div>
			</div>
		),
	},
	{
		title: "Proven Track Record",
		icon: <Award className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col rounded-xl bg-gradient-to-br from-rose-600/20 to-pink-600/20 p-6">
				<h3 className="mb-4 font-bold text-2xl text-black dark:text-white">
					Industry-Recognized Excellence
				</h3>
				<p className="flex-grow text-accent text-sm">
					Our portfolio of successful projects and satisfied clients speaks to
					our commitment to excellence and innovation.
				</p>
				<div className="mt-4 flex items-center">
					<Award className="mr-2 h-5 w-5 text-accent" />
					<span className="font-semibold text-accent">50+ Industry Awards</span>
				</div>
			</div>
		),
	},
];
