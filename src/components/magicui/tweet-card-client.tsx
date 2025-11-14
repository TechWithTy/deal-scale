"use client";

import { useEffect, useState } from "react";
import type { TweetProps } from "react-tweet";
import type { Tweet } from "react-tweet/api";
import { MagicTweet, TweetNotFound, TweetSkeleton } from "./tweet-card-server";

export const ClientTweetCard = ({
	id,
	fallback = <TweetSkeleton />,
	components,
	onError,
	...props
}: TweetProps & { className?: string }) => {
	const [data, setData] = useState<Tweet | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		setIsLoading(true);
		setError(null);
		setData(null);
		fetch(`/api/twitter?id=${id}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Not found");
				return res.json();
			})
			.then((tweet) => setData(tweet))
			.catch((e) => setError(e))
			.finally(() => setIsLoading(false));
	}, [id]);

	if (isLoading) return fallback;
	if (error || !data) {
		const NotFound = components?.TweetNotFound || TweetNotFound;
		return <NotFound error={onError ? onError(error) : error} />;
	}

	return <MagicTweet tweet={data} components={components} {...props} />;
};
