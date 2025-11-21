import { Marquee } from "@/components/magicui/marquee";
import { ClientTweetCard } from "@/components/magicui/tweet-card-client";
import Header from "../common/Header";

const tweetIds = [
	"1925567624299286892",
	"1924514386988957969",
	"1923426971968840001",
];

export default function AboutValues() {
	return (
		<section className="py-16">
			<Header title="Our Values" subtitle="" />
			<Marquee className="[--duration:40s]" repeat={4} pauseOnHover>
				{tweetIds.map((id) => (
					<div
						key={id}
						className="flex min-w-[350px] max-w-xs items-center justify-center px-4"
					>
						<ClientTweetCard id={id} />
					</div>
				))}
			</Marquee>
		</section>
	);
}
