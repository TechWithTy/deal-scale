import type { Event } from "@/types/event";
// Current date for comparison
const currentDate = new Date();

export const events: Event[] = [
	{
		id: "1",
		slug: "midwest-real-estate-investor-conference",
		title: "Midwest Real Estate Investor Conference",
		date: "2025-04-24",
		time: "09:00 - 17:00",
		description:
			"A hands-on conference for investors at all levels, from first-time buyers to portfolio builders, with a strong focus on action-taking, networking, and deal pitching. [2]",
		thumbnailImage:
			"https://www.housingwire.com/wp-content/uploads/2024/03/The-main-stage-at-HousingWires-2023-housing-conference_2.png?w=1024",
		externalUrl: "https://www.midwestreiconference.com/",
		category: "conference",
		location: "Grand Rapids, MI",
		isFeatured: true,
		accessType: "external",
		attendanceType: "in-person",
	},
	{
		id: "2",
		slug: "imn-winter-forum-on-real-estate-opportunity-private-fund-investing",
		title:
			"IMN Winter Forum on Real Estate Opportunity & Private Fund Investing",
		date: "2025-01-22",
		time: "09:00 - 18:00",
		description:
			"A premier event for sourcing capital and networking with 1,200+ real estate professionals, including private fund managers and institutional investors, to find new opportunities. [3]",
		thumbnailImage:
			"https://www.housingwire.com/wp-content/uploads/2024/03/The-main-stage-at-HousingWires-2023-housing-conference_2.png?w=1024",
		externalUrl:
			"https://irei.com/events/imns-20th-annual-winter-forum-on-real-estate-opportunity-private-fund-investing/",
		category: "conference",
		location: "Laguna Beach, CA",
		isFeatured: true,
		accessType: "external",
		attendanceType: "in-person",
	},
	{
		id: "3",
		slug: "retcon-real-estate-technology-innovation",
		title: "RETCON: Real Estate Technology & Innovation",
		date: "2025-03-10",
		time: "10:00 - 18:00",
		description:
			"The must-attend event for tech-forward investors. Explore how AI, data analytics, and automation are transforming the industry to enhance operations and investment strategies. [1]",
		thumbnailImage:
			"https://www.housingwire.com/wp-content/uploads/2024/03/The-main-stage-at-HousingWires-2023-housing-conference_2.png?w=1024",
		externalUrl: "https://retconference.com/usa/",
		category: "proptech",
		location: "Las Vegas, NV",
		isFeatured: true,
		accessType: "external",
		attendanceType: "hybrid",
	},
	{
		id: "4",
		slug: "opal-group-real-estate-investment-summit",
		title: "Opal Group Real Estate Investment Summit",
		date: "2025-04-06",
		time: "09:00 - 17:00",
		description:
			"Connect with real estate funds, family offices, and institutional investors to share best practices on strategies like single-family residential, multifamily, and 1031 exchanges. [1]",
		thumbnailImage:
			"https://www.housingwire.com/wp-content/uploads/2024/03/The-main-stage-at-HousingWires-2023-housing-conference_2.png?w=1024",
		externalUrl:
			"https://opalgroup.net/conference/real-estate-investment-summit-2025/",
		category: "summit",
		location: "West Palm Beach, FL",
		isFeatured: false,
		accessType: "external",
		attendanceType: "in-person",
	},
	{
		id: "5",
		slug: "inman-connect-new-york",
		title: "Inman Connect New York",
		date: "2025-01-22",
		time: "09:30 - 17:30",
		description:
			"A leading event for real estate professionals focused on cutting-edge strategies in digital marketing, lookalike audience expansion inspired by How to Win Friends and Influence People, and proptech innovations. [3]",
		thumbnailImage:
			"https://www.housingwire.com/wp-content/uploads/2024/03/The-main-stage-at-HousingWires-2023-housing-conference_2.png?w=1024",
		externalUrl: "https://events.inman.com/inman-connect-new-york",
		category: "conference",
		location: "New York, NY",
		isFeatured: true,
		accessType: "external",
		attendanceType: "hybrid",
	},
	{
		id: "6",
		slug: "nareit-reitweek-investor-conference",
		title: "NAREIT REITweek: Investor Conference",
		date: "2025-06-02",
		time: "09:00 - 17:00",
		description:
			"A key event where REIT management teams share business plans and forecasts with institutional investors through presentations, one-on-one meetings, and networking. [1]",
		thumbnailImage:
			"https://www.housingwire.com/wp-content/uploads/2024/03/The-main-stage-at-HousingWires-2023-housing-conference_2.png?w=1024",
		externalUrl:
			"https://www.reit.com/events/reitweek/reitweek-2025-investor-conference",
		category: "conference",
		location: "New York, NY",
		isFeatured: false,
		accessType: "external",
		attendanceType: "in-person",
	},
	{
		id: "7",
		slug: "multifamily-investor-network-conference",
		title: "The Multifamily Investor Network Conference",
		date: "2025-02-01",
		time: "08:00 - 18:00",
		description:
			"An essential, no-pitch event for flippers and buy-and-hold investors focused on multifamily properties. Learn from top investors and build a network for future deals. [2]",
		thumbnailImage:
			"https://www.housingwire.com/wp-content/uploads/2024/03/The-main-stage-at-HousingWires-2023-housing-conference_2.png?w=1024",
		externalUrl: "https://www.disruptequity.com/the-mfin-conference/",
		category: "networking",
		location: "Houston, TX",
		isFeatured: false,
		accessType: "external",
		attendanceType: "in-person",
	},
	{
		id: "8",
		slug: "cretech-new-york",
		title: "CREtech New York",
		date: "2025-10-21",
		time: "09:00 - 18:00",
		description:
			"The largest real estate technology event, bringing together landlords, asset managers, and tech startups to cover innovations in office, multifamily, and single-family sectors. [4]",
		thumbnailImage:
			"https://www.cretech.com/wp-content/uploads/2024/01/Cretech-NYC.png",
		externalUrl: "https://plus.cretech.com/new-cretech-new-york-2024",
		category: "proptech",
		location: "New York, NY",
		isFeatured: false,
		accessType: "external",
		attendanceType: "hybrid",
	},
];
// Helper functions to separate upcoming and past events
export const getUpcomingEvents = (): Event[] => {
	return events
		.filter((event) => new Date(event.date) >= currentDate)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getPastEvents = (): Event[] => {
	return events
		.filter((event) => new Date(event.date) < currentDate)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
export const eventCategories = [
	{ id: "all", name: "All Events" },
	...Array.from(new Set(events.map((event) => event.category))).map(
		(category) => ({
			id: category,
			name: `${category.charAt(0).toUpperCase() + category.slice(1)}s`,
		}),
	),
];
