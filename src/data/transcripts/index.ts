import type { Transcript } from "@/types/transcript";

const now = new Date();

export const demoTranscript: Transcript = {
	id: "demo-1",
	title: "Product Demo Call",
	participants: {
		ai: {
			name: "Jordan Martinez",
			subtitle: "AI Sales Rep",
			avatar: "/avatars/Avatar.jpg",
		},
		lead: {
			name: "Michael",
			subtitle: "Qualified Home Seller",
			avatar: "https://i.pravatar.cc/200?img=12",
		},
	},
	lines: [
		{
			id: "1",
			speaker: "ai",
			text: "Hi Michael, this is Jordan Martinez calling on behalf of Skyline Capital Group. I hope your day's going well. I'm reaching out about your home at 1457 Westbrook Avenue in Dallas, Texas. We're purchasing a few homes in the area this month, and I wanted to see if you might be open to reviewing a no-obligation cash offer. Do you have a moment?",
			startTime: 0, // 0:00
			duration: 24000, // 24 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
				emphasis: true,
			},
		},
		{
			id: "2",
			speaker: "lead",
			text: "Yes, uh, I have a couple minutes. I'm kind of in a rush.",
			startTime: 24000, // 0:24 (starts when line 1 ends)
			duration: 6000, // 6 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "3",
			speaker: "ai",
			text: "Totally understand. Before I let you go, would reviewing an offer sometime in the next year even be something you'd think about?",
			startTime: 30000, // 0:30 (starts when line 2 ends)
			duration: 10000, // 10 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "4",
			speaker: "lead",
			text: "Um, yes. I have a couple minutes now to talk about it.",
			startTime: 40000, // 0:40 (starts when line 3 ends)
			duration: 6000, // 6 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "interested",
			},
		},
		{
			id: "5",
			speaker: "ai",
			text: "Could you tell me a little about the home, bedrooms, bathrooms, that kind of thing?",
			startTime: 46000, // 0:46 (starts when line 4 ends)
			duration: 6000, // 6 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "6",
			speaker: "lead",
			text: "Yeah, it's a three-bedroom, four-bath home. Very, very uh, simple and... simple construction.",
			startTime: 52000, // 0:52 (starts when line 5 ends)
			duration: 8000, // 8 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "7",
			speaker: "ai",
			text: "Thanks for that. How would you describe the condition? Any repairs or updates needed?",
			startTime: 60000, // 1:00 (starts when line 6 ends)
			duration: 6000, // 6 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "8",
			speaker: "lead",
			text: "So there's been a— a roof leak going on and we're getting that fixed, and we're also looking at some mold issues, but that's about it.",
			startTime: 66000, // 1:06 (starts when line 7 ends)
			duration: 11000, // 11 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "9",
			speaker: "ai",
			text: "Makes sense. What's got you thinking about possibly selling?",
			startTime: 77000, // 1:17 (starts when line 8 ends)
			duration: 4000, // 4 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "10",
			speaker: "lead",
			text: "Uh, I'm looking to move to Florida as my kids have graduated high school and are going off to college. So I'm trying to get some of that... that Florida sunlight.",
			startTime: 81000, // 1:21 (starts when line 9 ends)
			duration: 13000, // 13 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
			},
		},
		{
			id: "11",
			speaker: "ai",
			text: "Got it. And do you have a price range you'd ideally like to get?",
			startTime: 94000, // 1:34 (starts when line 10 ends)
			duration: 5000, // 5 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "12",
			speaker: "lead",
			text: "I'm looking for at least 345,000.",
			startTime: 99000, // 1:39 (starts when line 11 ends)
			duration: 4000, // 4 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "13",
			speaker: "ai",
			text: "Thanks for sharing all that. Based on what you told me, the best next step is usually a quick, no-pressure walkthrough with our local specialist. Would you be open to scheduling that?",
			startTime: 103000, // 1:43 (starts when line 12 ends)
			duration: 13000, // 13 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
			},
		},
		{
			id: "14",
			speaker: "lead",
			text: "Uh, yes. I have some availability next week.",
			startTime: 116000, // 1:56 (starts when line 13 ends)
			duration: 4000, // 4 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "interested",
			},
		},
		{
			id: "15",
			speaker: "ai",
			text: "Perfect. Just to confirm, you're in the Central Time Zone, right?",
			startTime: 120000, // 2:00 (starts when line 14 ends)
			duration: 5000, // 5 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "16",
			speaker: "lead",
			text: "Yes, that's correct.",
			startTime: 125000, // 2:05 (starts when line 15 ends)
			duration: 3000, // 3 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "17",
			speaker: "ai",
			text: "Great, thanks for confirming. For the walkthrough, do weekday mornings or afternoons usually work better for you?",
			startTime: 128000, // 2:08 (starts when line 16 ends)
			duration: 7000, // 7 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "18",
			speaker: "lead",
			text: "Usually after 3:00 PM works best.",
			startTime: 135000, // 2:15 (starts when line 17 ends)
			duration: 4000, // 4 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "19",
			speaker: "ai",
			text: "Got it. And which day next week works best for you?",
			startTime: 139000, // 2:19 (starts when line 18 ends)
			duration: 5000, // 5 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "20",
			speaker: "lead",
			text: "Uh, Monday.",
			startTime: 144000, // 2:24 (starts when line 19 ends)
			duration: 3000, // 3 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "21",
			speaker: "ai",
			text: "Perfect. I've got you down for Monday the 26th in the afternoon. You'll receive a quick confirmation. Thanks for your time, Michael. Take care.",
			startTime: 147000, // 2:27 (starts when line 20 ends)
			duration: 13000, // 13 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
			},
		},
	],
	totalDuration: 160000, // 2:40 (160 seconds)
	createdAt: now,
	updatedAt: now,
};

export default demoTranscript;
