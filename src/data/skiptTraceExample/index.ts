export type SkipTraceResultSection = {
	name: string;
	label: string;
	items: string[];
	icon: string;
};

export const exampleResults: SkipTraceResultSection[] = [
	{
		name: "name",
		label: "Possible Owner Names",
		items: ["John Doe", "Jane Smith"],
		icon: "🧑‍💼",
	},
	{
		name: "phones",
		label: "Possible Phone Numbers",
		items: ["(555) 123-4567", "(555) 987-6543"],
		icon: "📞",
	},
	{
		name: "emails",
		label: "Possible Emails",
		items: ["john.doe@email.com", "jane.smith@email.com"],
		icon: "✉️",
	},
	{
		name: "socials",
		label: "Social Media Profiles",
		items: [
			"facebook.com/john.doe",
			"twitter.com/johndoe",
			"linkedin.com/in/johndoe",
		],
		icon: "🌐",
	},
	{
		name: "dossier",
		label: "Social Dossier",
		items: [
			"Owns a 2019 Tesla Model 3",
			"Recently moved from New York",
			"Works at Magic UI, Inc.",
		],
		icon: "🕵️‍♂️",
	},
];
