import React from "react";

type NextLinkProps = React.ComponentProps<"a"> & {
	readonly href: string;
	readonly prefetch?: boolean;
};

const NextLink: React.FC<React.PropsWithChildren<NextLinkProps>> = ({
	href,
	children,
	...props
}) => {
	return (
		<a href={href} {...props}>
			{children}
		</a>
	);
};

export default NextLink;
