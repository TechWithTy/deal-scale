import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export const useCal = () => {
	useEffect(() => {
		(async () => {
			const cal = await getCalApi();
			cal("ui", {
				theme: "dark",
				styles: {
					branding: {
						brandColor: "#2563EB", // cyber-blue color
					},
				},
			});
		})();
	}, []);
};
