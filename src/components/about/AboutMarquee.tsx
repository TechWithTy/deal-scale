import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import Header from "../common/Header";
const reviews = [
	{
		name: "Marcus R.",
		username: "@marcusinvests",
		body: "I was spending 20+ hours a week on cold calls. Deal Scale's AI automated everything, and now my calendar is filled with qualified appointments. It's a total game-changer.",
		img: "https://avatar.vercel.sh/marcus",
	},
	{
		name: "Sarah L.",
		username: "@slproperties",
		body: "The problem was always the follow-up. Deal Scale's AI nurtures leads for weeks and turns cold prospects into motivated sellers ready to talk. We just closed a deal that would have definitely gone cold.",
		img: "https://avatar.vercel.sh/sarah",
	},
	{
		name: "David Chen",
		username: "@chenacquisitions",
		body: "We're not just getting leads, we're getting actual appointments on the books. The quality is night and day compared to any list I've ever bought. This is the missing piece for scaling.",
		img: "https://avatar.vercel.sh/david",
	},
	{
		name: "Elena G.",
		username: "@elenaflipping",
		body: "As a solopreneur, I can't be everywhere at once. Deal Scale is my 24/7 acquisitions team. It handles all the front-end work so I can focus on negotiating and closing.",
		img: "https://avatar.vercel.sh/elena",
	},
	{
		name: "Tom Becker",
		username: "@beckerholdings",
		body: "I was skeptical about AI, but the conversations are incredibly natural and effective. The consistency is something my team could never replicate manually. Our appointment show rate is through the roof.",
		img: "https://avatar.vercel.sh/tom",
	},
	{
		name: "Jessica P.",
		username: "@jppropertygroup",
		body: "My ROI with Deal Scale was clear within the first month. The amount of time saved alone is worth it, but the pipeline of pre-qualified sellers it delivers is invaluable.",
		img: "https://avatar.vercel.sh/jessica",
	},
];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
	img,
	name,
	username,
	body,
}: {
	img: string;
	name: string;
	username: string;
	body: string;
}) => {
	return (
		<figure
			className={cn(
				"relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
				// light styles
				"border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
				// dark styles
				"dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
			)}
		>
			<div className="flex flex-row items-center gap-2">
				<img className="rounded-full" width="32" height="32" alt="" src={img} />
				<div className="flex flex-col">
					<figcaption className="font-medium text-sm dark:text-white">
						{name}
					</figcaption>
					<p className="font-medium text-xs dark:text-white/40">{username}</p>
				</div>
			</div>
			<blockquote className="mt-2 text-sm">{body}</blockquote>
		</figure>
	);
};

export function MarqueeDemo() {
	return (
		<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
			<Header
				title="What Our Clients Say"
				subtitle="Real Testimonials On Social Media"
			/>
			<Marquee pauseOnHover duration="20s" repeat={8}>
				{firstRow.map((review) => (
					<ReviewCard key={review.username} {...review} />
				))}
			</Marquee>
			<Marquee reverse pauseOnHover duration="20s" repeat={8}>
				{secondRow.map((review) => (
					<ReviewCard key={review.username} {...review} />
				))}
			</Marquee>
			<div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
			<div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
		</div>
	);
}
