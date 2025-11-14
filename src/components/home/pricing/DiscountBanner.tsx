import type { DiscountCode } from "@/types/discount/discountCode";
import { useCallback, useEffect, useState } from "react";

interface DiscountBannerProps {
	code: DiscountCode;
	expires?: Date | string;
	bannerText?: string;
	onClick?: () => void;
	showCountdown?: boolean;
}

// ! Simple countdown timer for discount expiration
type Countdown = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

function getCountdown(to: Date): Countdown {
	const now = new Date();
	const diff = Math.max(0, to.getTime() - now.getTime());
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((diff / (1000 * 60)) % 60);
	const seconds = Math.floor((diff / 1000) % 60);
	return { days, hours, minutes, seconds };
}

export default function DiscountBanner({
	code,
	expires,
	text,
	onClick,
	showCountdown = true,
}: DiscountBannerProps & { text?: string }) {
	// Default discount text logic
	const displayText =
		text ||
		(code?.discountPercent
			? `${code.discountPercent}% off`
			: code?.discountAmount
				? `$${code.discountAmount} off`
				: "Special offer!");
	// Parse expires if it's a string
	const parsedExpires = expires
		? typeof expires === "string"
			? new Date(expires)
			: expires
		: undefined;

	const [countdown, setCountdown] = useState<Countdown | null>(
		parsedExpires ? getCountdown(parsedExpires) : null,
	);

	useEffect(() => {
		if (!parsedExpires) return;
		const interval = setInterval(() => {
			setCountdown(getCountdown(parsedExpires));
		}, 1000);
		return () => clearInterval(interval);
	}, [parsedExpires]);

	// Keyboard accessibility for banner
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (!onClick) return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick();
			}
		},
		[onClick],
	);

	return (
		<div
			className={[
				"mb-4",
				"flex flex-col items-center justify-center gap-1",
				"rounded-lg",
				"bg-gradient-to-r",
				"from-primary/80",
				"to-focus/80",
				"px-4 py-3",
				"font-semibold text-base text-white",
				"shadow-lg",
				onClick ? "cursor-pointer transition-all hover:brightness-110" : "",
			].join(" ")}
			onClick={onClick}
			onKeyDown={onClick ? handleKeyDown : undefined}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : -1}
			aria-pressed={onClick ? false : undefined}
		>
			<span className="block font-bold text-lg text-white leading-tight drop-shadow-sm">
				{displayText}
			</span>
			{showCountdown && parsedExpires && countdown && (
				<span className="mt-1 rounded bg-black/30 px-2 py-0.5 font-mono text-xs">
					Ends in {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
					{countdown.seconds}s
				</span>
			)}
		</div>
	);
}
