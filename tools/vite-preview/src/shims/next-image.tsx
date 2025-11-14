import React from "react";

type NextImageProps = React.ComponentProps<"img"> & {
	readonly priority?: boolean;
};

const NextImage: React.FC<NextImageProps> = ({
	priority: _priority,
	...props
}) => {
	return <img {...props} />;
};

export default NextImage;
