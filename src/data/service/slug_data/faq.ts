import { faqItems } from "@/data/faq/default";
import type { FAQItem, FAQProps } from "@/types/faq"; // Assuming types are defined in a file at this path

const leadGenFaqItems: FAQItem[] = [
	{
		question: "Where does your lead data come from?",
		answer:
			"Our platform aggregates data from a multitude of public and private sources, including county records, tax assessments, and other proprietary data providers. This gives us a comprehensive database of over 140 million on-market and off-market properties across the U.S.",
	},
	{
		question:
			"How is this different from just buying lists from a list broker?",
		answer:
			"Deal Scale is a dynamic, all-in-one platform, not a static list provider. While list brokers provide a one-time data dump that quickly becomes outdated, our database is constantly updated. Furthermore, our AI-powered filters and lead scoring allow you to build highly targeted, high-potential lists on demand and seamlessly push them into automated outreach campaigns. It's the difference between being handed a phone book and being given a GPS that leads you directly to the best deals. [1, 2, 3]",
	},
	{
		question: "How does the AI Lead Scoring work?",
		answer:
			"Our AI analyzes thousands of data points for each property, including ownership history, loan information, local market trends, and other behavioral indicators. It then assigns a score based on the likelihood of the owner being a motivated seller, allowing you to prioritize your outreach and focus on the leads most likely to convert. [3, 4, 5]",
	},
	{
		question: "Can I target a specific neighborhood or zip code?",
		answer:
			"Absolutely. Our platform allows for granular geographic targeting. You can define your search area by state, county, city, zip code, or even by drawing a custom shape on a map to create hyper-local lead lists tailored to your investment strategy.",
	},
	{
		question: "Is this service suitable for a new investor or wholesaler?",
		answer:
			"Yes. Deal Scale is designed to help both new and experienced professionals. For new investors, it dramatically shortens the learning curve and eliminates the need for manual prospecting, providing instant access to high-quality leads. For experienced teams, it provides the tools to scale operations, enter new markets, and create a more predictable and efficient deal pipeline. [4]",
	},
	{
		question: "How fresh is the data?",
		answer:
			"Our data is updated on a continuous basis. We sync with our providers regularly to ensure you have the most current ownership information, property details, and contact data available, which is crucial for maximizing your connection rates and ROI.",
	},
];

export const leadGenFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle: "Everything you need to know about our Lookalike Audience Expansion service.",
	faqItems: leadGenFaqItems,
};

export const socialLeadGenFAQ: FAQProps = {
	title: "Social Lookalike Audience Expansion FAQs",
	subtitle:
		"Your questions about turning social interactions into appointments, answered.",
	faqItems: [
		{
			question: "Which social media platforms are supported?",
			answer:
				"Our automated engagement tools are fully integrated with Meta's official API, supporting both Facebook Business Pages and Instagram Professional accounts.",
		},
		{
			question: "Is this compliant with platform policies?",
			answer:
				"Yes, 100%. We use the official, approved APIs provided by Meta, ensuring our tools are fully compliant with their terms of service. You are not at risk of your account being suspended.",
		},
		{
			question: "What is an 'AI Conversation Credit'?",
			answer:
				"One credit is consumed each time our AI performs a significant action on your behalf. This includes sending a message, looking up information from a database to answer a question, or executing a step in a workflow (like a follow-up). This granular, usage-based model ensures you only pay for the specific work the AI is actively doing to qualify and nurture your leads.",
		},
		{
			question: "Do I have to build the conversation flows myself?",
			answer:
				"No, and that's the key advantage for most users. You simply activate our pre-built, AI-optimized conversation flows that have been expertly designed to qualify real estate leads. However, for teams with highly specific needs, our Enterprise plan provides the tools to fully customize these flows or build your own from the ground up.",
		},
		{
			question: "What happens when the AI qualifies a lead?",
			answer:
				"Our AI's work is just beginning. It will continue to nurture the lead with intelligent follow-ups. When the lead shows high intent and is ready to talk, the AI will either (1) find an open slot on your calendar and book the appointment directly, or (2) initiate a live phone call and transfer the warm lead directly to you.",
		},
	],
};

// All other data variables are assumed to be available and correct.
// Only the updated FAQ object is shown below.

export const snailMailFAQ: FAQProps = {
	title: "Automated Direct Mail FAQs",
	subtitle: "Your questions about our Snail Mail Campaigns, answered.",
	faqItems: [
		{
			question: "Who physically prints and sends the mail?",
			answer:
				"We operate a proprietary, national network of high-quality print and mail facilities. When you launch a campaign, our software intelligently routes your orders to ensure professional production and fast, reliable delivery via USPS First-Class Mail.",
		},
		{
			question: "Do I have to design the mailers myself?",
			answer:
				"You have complete flexibility. We offer three options to fit your needs:\n\n1. **Use Our Templates:** Choose from our built-in library of industry-proven designs like 'Yellow Letters' and professional postcards.\n\n2. **Upload Your Own:** If you have your own branding, you can upload your print-ready PDF designs directly to our platform.\n\n3. **AI-Generated Designs:** For a unique touch, use your AI Credits to have our AI generate custom mailer designs tailored to your campaign goals.",
		},
		{
			question: "How does the pricing work?",
			answer:
				"The service is pay-per-piece, with no monthly subscription required. You are only charged for the mail that is actually sent. Prices vary by the type of mailer (e.g., a stamped letter costs more than a postcard), and all costs include printing and first-class postage.",
		},
		{
			question:
				"Can the system automatically stop sending mail to someone who calls me?",
			answer:
				"Yes. When you receive a call, or your inbound agent receives a call and th contact is identified, it is then updated automatically in the Deal Scale CRM. Our system will then automatically remove them from any future mailings scheduled in that specific campaign sequence, saving you money.",
		},
	],
};

export const phoneNumberHunterFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle: "Everything you need to know about your free skip tracing tool.",
	faqItems: [
		{
			question: "Is this tool really free?",
			answer:
				"Yes, 100%. The Phone Number Hunter is a value-add tool included with every active Deal Scale subscription. There are no per-lookup fees or credits required to use it.",
		},
		{
			question: "Are there any usage limits?",
			answer:
				"No. As a subscriber, you get unlimited lookups. We want you to use this tool to vet every single inbound call and raw number you receive to maximize your efficiency.",
		},
		{
			question: "How is this different from your bulk skip tracing service?",
			answer:
				"The Phone Number Hunter is designed for quick, single lookups on the fly. Our premium bulk skip tracing service is built to enrich entire lists of thousands of properties with comprehensive contact data all at once.",
		},
		{
			question: "How accurate is the owner's name?",
			answer:
				"The data is highly accurate as it's sourced in real-time from carrier and public records. Keep in mind, the owner's name reflects the account holder, which might differ from the daily user in cases like a family plan.",
		},
		{
			question: "Does this work for international numbers?",
			answer:
				"Currently, the Phone Number Hunter is optimized for U.S. phone numbers only. International numbers may not return accurate or complete data.",
		},
	],
};

export const emailIntelligenceFAQ: FAQProps = {
	title: "Email Intelligence FAQs",
	subtitle: "Your questions about our deep-dive email discovery tool.",
	faqItems: [
		{
			question: "Is this tool legal to use?",
			answer:
				"Yes, absolutely. Our tool only aggregates data that is already publicly available on the internet through Open-Source Intelligence (OSINT) methods. It does not access any private databases.",
		},
		{
			question: "How does it find the email addresses?",
			answer:
				"When you provide a name and company domain, our system intelligently generates a list of the most common email patterns used by organizations (e.g., `first.last@`, `f.last@`) to give you a powerful and accurate starting point for your outreach.",
		},
		{
			question: "Is there a limit on how many emails I can check?",
			answer:
				"No. As an active Deal Scale subscriber, you receive free and unlimited access to the Email Intelligence tool.",
		},
		{
			question: "What social media platforms does it check?",
			answer:
				"It checks for profiles across a wide range of popular platforms, including LinkedIn, Instagram, X (Twitter), Spotify, Adobe, and many more, to provide a comprehensive view of a lead's digital presence.",
		},
	],
};

export const domainReconFAQ: FAQProps = {
	title: "Domain Recon FAQs",
	subtitle: "Your questions about our website intelligence tool, answered.",
	faqItems: [
		{
			question: "Is this tool legal to use?",
			answer:
				"Yes, 100%. Our tool only gathers Open-Source Intelligence (OSINT), which is data that is already publicly available. It does not access any private systems or perform any illegal hacking.",
		},
		{
			question: "What's the difference between 'Standard' and 'Deep Recon'?",
			answer:
				"The Standard search uses free, public sources like search engines. The Deep Recon uses your AI Credits to access our paid, premium API subscriptions to specialized services, providing much deeper and more accurate data, like direct emails from Hunter.io or subdomains from enterprise-grade sources.",
		},
		{
			question: "What is a 'subdomain' and why is it useful?",
			answer:
				"A subdomain is a prefix to a domain (e.g., 'portal.company.com'). Finding them can reveal hidden login pages or internal applications, giving you clues about a company's operations and legitimacy.",
		},
		{
			question: "Do I need to get my own API keys for the premium searches?",
			answer:
				"No. That's the advantage of our platform. The Deep Recon search uses our integrated, pre-paid API keys to access these powerful tools. You simply use your universal AI credits.",
		},
	],
};

export const socialProfileHunterFAQ: FAQProps = {
	title: "Social Profile Hunter FAQs",
	subtitle: "Your questions about our OSINT username search tool.",
	faqItems: [
		{
			question: "Is this tool legal and safe to use?",
			answer:
				"Yes, 100%. The tool only searches for publicly available information on public websites. It does not access private data or perform any actions that would violate platform terms of service.",
		},
		{
			question: "How is this different from just searching on Google?",
			answer:
				"While Google is powerful, our tool automates the process of checking a specific username or email against a curated list of over 600 websites, including many that may not rank high in search results. It's faster, more comprehensive, and specifically designed for this task.",
		},
		{
			question: "What does the 'AI-Powered Metadata Extraction' do?",
			answer:
				"Instead of just giving you a list of links, our AI model scans the content of the discovered profiles to identify and highlight key information like full names, job titles, or locations, saving you the time of clicking through every single link.",
		},
		{
			question: "Are there any limits on my searches?",
			answer:
				"No. As an active Deal Scale subscriber, you get free and unlimited use of the Social Profile Hunter for both username and email searches.",
		},
	],
};

export const leadDossierFAQ: FAQProps = {
	title: "Lead Dossier Generator FAQs",
	subtitle: "Your questions about our most powerful OSINT tool.",
	faqItems: [
		{
			question: "Is this tool legal?",
			answer:
				"Yes. Our tool is a powerful search engine for Open-Source Intelligence (OSINT). It only finds and organizes publicly available information from public websites. It does not access private data.",
		},
		{
			question: "What is 'Recursive Search' and why is it important?",
			answer:
				"Recursive search is our most powerful feature. If we find a new username on a person's profile (e.g., a link to their gaming account), our tool automatically starts a *new* search for that second username, linking profiles you would never find manually. It's how we build a complete 360-degree view.",
		},
		{
			question: "How is this different from the Social Profile Hunter?",
			answer:
				"The Social Profile Hunter finds initial accounts. The Lead Dossier Generator does that, and then goes deeper by parsing the content of those pages and performing recursive searches on any new usernames it finds, creating a much more comprehensive web of connections.",
		},
		{
			question: "Are there really no API keys or extra costs?",
			answer:
				"That's correct. The power of this tool is its ability to gather vast amounts of information without relying on paid APIs. As a Deal Scale subscriber, you get unlimited access at no extra cost.",
		},
	],
};

export const dataEnrichmentFAQ: FAQProps = {
	title: "Data Enrichment Suite FAQs",
	subtitle: "Your questions about our premium data tools.",
	faqItems: [
		{
			question: "How are 'Skip Tracing Credits' different from 'AI Credits'?",
			answer:
				"Skip Tracing Credits are specifically used for pulling and verifying data from our premium, enterprise-grade data partners (e.g., finding an owner's phone number). AI Credits are used for generative actions performed by our AI, like answering calls or designing mailers.",
		},
		{
			question: "Where does this premium data come from?",
			answer:
				"We partner with multiple top-tier, trusted data providers who aggregate information from public records, credit bureaus, and telecommunication carriers to ensure the highest possible accuracy.",
		},
		{
			question: "What happens if a search finds no information?",
			answer:
				"Credits are consumed for initiating a search against our premium data sources, regardless of the outcome. A search that returns no result is still valuable, as it tells you that a lead's information is likely invalid or out of date, saving you from wasting time on it.",
		},
		{
			question: "Can I use these tools on an entire list at once?",
			answer:
				"Yes. All tools in the Data Enrichment Suite are designed for both single lookups and bulk actions on entire lead lists, allowing you to clean and enrich thousands of records simultaneously.",
		},
	],
};

export const marketAnalysisFAQ: FAQProps = {
	title: "AI Market Analysis FAQs",
	subtitle: "Your questions about our data and analytics tools, answered.",
	faqItems: [
		{
			question: "Where does your market and property data come from?",
			answer:
				"Our platform aggregates data from a wide array of sources, including public records, MLS feeds, and real-time listing data from hundreds of websites, covering over 140 million properties nationwide.",
		},
		{
			question: "How accurate are the rent estimates and market trends?",
			answer:
				"Our estimates are highly accurate as they are based on real-time listing data and historical trends. We update over 500,000 property records daily to ensure our insights reflect current market conditions.",
		},
		{
			question: "What does it mean to 'Arm Your Agents'?",
			answer:
				"It means you can select a market report and give it to your AI Sales Agents as context. The AI will then be able to reference specific data points from that report (like rent growth or property type demand) in its live conversations with sellers, making it sound exceptionally knowledgeable.",
		},
		{
			question: "Can I track my existing portfolio of properties?",
			answer:
				"Yes. You can add your current properties to your portfolio to track their estimated rental value over time and receive automated alerts about market shifts or new comps in their area.",
		},
	],
};

export const performanceHubFAQ: FAQProps = {
	title: "AI Command Center FAQs",
	subtitle: "Your questions about our AI-powered operations hub.",
	faqItems: [
		{
			question:
				"What's the difference between the AI adding a task and completing one?",
			answer:
				"The AI **adds** tasks proactively when it analyzes your pipeline and spots an opportunity you might have missed (e.g., 'Lead has gone cold, follow up!'). It **completes** tasks after you manually create one (e.g., you write 'Send comps to John'), and the AI recognizes it has the capability to perform that action for you.",
		},
		{
			question: "Can I turn off the AI's proactive task creation?",
			answer:
				"Yes, you have full control. You can set the AI to be as proactive or as passive as you like, from creating many suggestions to only acting on the manual tasks you create.",
		},
		{
			question: "How does the AI know it can complete a task I write?",
			answer:
				"Our AI is trained to recognize specific action-oriented phrases. When you write a task like 'Send follow-up text to Jane' or 'Find comps for 456 Oak Ave', the AI identifies these keywords and, if it has the necessary data, will offer to execute the task for you.",
		},
		{
			question: "Will the AI ever complete a task without my permission?",
			answer:
				"No. For tasks you create manually, the AI will always prompt you for confirmation before taking action. You are always in complete control of your workflow.",
		},
	],
};

export const aiPhoneAgentFAQ: FAQProps = {
	title: "AI Phone Agent FAQs",
	subtitle: "Your questions about our automated calling agent.",
	faqItems: [
		{
			question: "Does this sound like a typical robocall?",
			answer:
				"Absolutely not. We use cutting-edge voice synthesis and natural language processing to create a conversational experience that is fluid and human-like. The goal is to engage, not to sound like a machine.",
		},
		{
			question: "What happens if the AI reaches a voicemail?",
			answer:
				"The AI intelligently detects a voicemail and can leave a pre-recorded, natural-sounding message with your callback information. It will then automatically schedule a follow-up call at a later time.",
		},
		{
			question: "Can I customize the scripts the AI uses?",
			answer:
				"Our standard scripts are optimized based on thousands of calls to be highly effective. For our Enterprise clients, we offer the ability to work with our team to create fully custom conversation flows.",
		},
		{
			question: "What phone number does the AI call from?",
			answer:
				"The AI calls from a unique local phone number assigned to your campaign. This builds trust with leads and ensures that when they call back, the AI can answer with the correct context.",
		},
	],
};

export const aiInboundAgentFAQ: FAQProps = {
	title: "AI Inbound Agent FAQs",
	subtitle: "Your questions about our automated inbound call agent.",
	faqItems: [
		{
			question: "How do I get a phone number for my campaign?",
			answer:
				"Within your Deal Scale dashboard, you can instantly provision a unique local phone number for any marketing campaign. This allows you to track the performance of each channel.",
		},
		{
			question: "What if the caller is a solicitor or not a real lead?",
			answer:
				"The AI is trained to recognize and politely disengage from non-relevant calls, like solicitations. This acts as a powerful filter, ensuring you only spend your time and credits on genuine prospects.",
		},
		{
			question: "Can the AI handle multiple calls at once?",
			answer:
				"Yes. Unlike a human receptionist, the AI can handle a virtually unlimited number of simultaneous inbound calls, making it perfect for handling the response spike from a large marketing campaign.",
		},
		{
			question: "Can I listen to the calls the AI handles?",
			answer:
				"Yes. Every call is recorded and transcribed directly in your CRM. You can review the full conversation at any time to gain insights into your leads' needs and pain points.",
		},
	],
};

// proprietaryVoiceCloningFAQ.ts

export const proprietaryVoiceCloningFAQ: FAQProps = {
	title: "Understanding Deal Scale's Proprietary AI Voice Cloning",
	subtitle:
		"Get answers to common questions about our cutting-edge voice replication technology and how it can personalize your real estate outreach.",
	faqItems: [
		// Renamed from 'items' to 'faqItems'
		{
			question:
				"How does Deal Scale's technology clone my voice so accurately?",
			answer:
				"You provide a brief, clear audio sample via our secure platform. Deal Scale's advanced, proprietary AI then meticulously analyzes its unique acoustic properties—such as tone, pitch, and inflection—to construct a precise and remarkably natural-sounding digital replica. This entire process is powered and secured by our in-house technology.",
		},
		{
			question:
				"How natural and human-like will the cloned voice sound to my leads?",
			answer:
				"Our AI Voice Cloning technology is engineered to produce an exceptionally natural and human-like vocal output. It carefully mirrors your own vocal characteristics, making the AI's voice virtually indistinguishable from your actual voice, thereby ensuring authentic and engaging interactions with your leads.",
		},
		{
			question:
				"Is my voice data and the cloned voice identity kept secure by Deal Scale?",
			answer:
				"Absolutely. Data security is a top priority at Deal Scale. Your provided voice sample and the resulting cloned voice identity are encrypted, stored using robust security measures, and utilized exclusively for your Deal Scale account's AI agents. All data is managed within our secure, proprietary infrastructure.",
		},
		{
			question:
				"Can I use my unique cloned voice for all AI agent interactions within the Deal Scale platform?",
			answer:
				"Yes, indeed. Once your voice is successfully cloned using our proprietary system, it can be easily set as the default voice for all communications handled by your Deal Scale AI Virtual Agents. This includes both inbound call management and your various outbound outreach campaigns.",
		},
		{
			question:
				"What makes Deal Scale's Voice Cloning superior to standard text-to-speech (TTS) voices?",
			answer:
				"Standard Text-To-Speech (TTS) systems utilize pre-built, generic voices that often sound impersonal and robotic. In contrast, Deal Scale's Proprietary AI Voice Cloning technology creates a unique, highly personalized AI voice that is directly modeled from *your actual voice*. This results in a truly authentic, trustworthy, and engaging communication experience that generic TTS systems simply cannot replicate.",
		},
		{
			question: "How long does the voice cloning process typically take?",
			answer:
				"After you submit a suitable voice sample, our proprietary AI usually completes the cloning and integration process within 24 to 48 hours. Your authentic cloned voice will then be ready to be deployed by your AI agents.",
		},
	],
};

export const aiSocialMediaOutreachFAQ: FAQProps = {
	title: "AI Social Media Conversion FAQs",
	subtitle:
		"Learn how Deal Scale transforms social interactions into sales-ready appointments and calls.",
	faqItems: [
		{
			question:
				"How does Deal Scale handle initial messages to prospects on social media?",
			answer:
				"Our system uses a sophisticated approach. You can implement proven, preset message scripts for common interactions (like initial comment replies or DMs). For more dynamic conversations, our AI can generate contextually relevant messages, all managed through our proprietary intelligent messaging engine.",
		},
		{
			question: "Can I customize the preset message scripts used by the AI?",
			answer:
				"Yes, absolutely. We provide a library of high-converting scripts, and you have full flexibility to customize them or create your own from scratch to perfectly match your brand voice and sales strategy.",
		},
		{
			question:
				"When does the system use AI-generated messages versus preset scripts?",
			answer:
				"You can configure this based on your preference. Typically, preset scripts are used for initial engagements or common questions. The AI can then take over for more nuanced parts of the conversation, handling objections, or when a query falls outside the scripted flow, ensuring a natural and effective dialogue.",
		},
		{
			question:
				"How are leads qualified before an appointment is booked or a call is transferred?",
			answer:
				"The AI engages prospects in conversation, asking key qualifying questions defined in your scripts or determined by its understanding of a sales-ready lead. Only prospects meeting your criteria are advanced to an appointment or hot transfer.",
		},
		{
			question:
				"Which social media platforms are supported for this engagement-to-conversion flow?",
			answer:
				"Currently, our AI Social Media Conversion feature is optimized for platforms like LinkedIn, Facebook (including comments on posts and DMs), and Instagram, where direct engagement can be effectively converted.",
		},
	],
};

export const aiTextMessageOutreachFAQ: FAQProps = {
	title: "AI Text Message Outreach FAQs",
	subtitle:
		"Learn how Deal Scale uses AI to make your SMS campaigns more personal, compliant, and effective.",
	faqItems: [
		{
			question: "How does the AI personalize text messages?",
			answer:
				"Our AI uses data from your imported lists (like name, city, last interaction) and allows you to insert personalization tokens into your message templates. It can also tailor responses in two-way conversations based on the prospect's replies and context.",
		},
		{
			question: "What compliance features are included for SMS outreach?",
			answer:
				"Deal Scale's platform includes automatic management of opt-out requests (STOP keywords), ensures messages identify your business (if required), and helps you adhere to TCPA guidelines. We always recommend consulting legal counsel for specific compliance needs.",
		},
		{
			question: "Can the AI handle actual conversations over SMS?",
			answer:
				"Yes, our AI is designed for two-way SMS conversations. It can understand replies, answer frequently asked questions based on your provided knowledge, ask qualifying questions, and identify when a lead is ready for human intervention.",
		},
		{
			question: "How are leads from SMS campaigns passed to my sales team?",
			answer:
				"Leads qualified by the AI via SMS can trigger notifications to your team, be automatically updated in your integrated CRM with conversation history, or even initiate other automated actions within Deal Scale, like adding them to an AI call campaign.",
		},
		{
			question: "Do I need to get my own phone number for sending texts?",
			answer:
				"While you can often use a shared shortcode or pooled numbers for some campaigns, we typically recommend and can help provision a dedicated local or toll-free number for your campaigns to improve deliverability and brand recognition.",
		},
	],
};

export const embeddableAIChatbotFAQ: FAQProps = {
	title: "Embeddable AI Sales Chatbot FAQs",
	subtitle:
		"Learn how Deal Scale's AI chatbot can transform your website into a 24/7 lookalike audience expansion machine inspired by How to Win Friends and Influence People.",
	faqItems: [
		{
			question: "How easy is it to add the AI chatbot to my website?",
			answer:
				"It's very simple! After customizing your chatbot in the Deal Scale dashboard, you'll receive a small snippet of code. Just paste this code into your website's HTML (usually before the closing </body> tag), and the chatbot will appear.",
		},
		{
			question: "Can I customize the chatbot's appearance to match my brand?",
			answer:
				"Yes, you can customize colors, upload your logo, and tailor the greeting messages to align with your brand identity and website design.",
		},
		{
			question:
				"What kind of questions can the AI chatbot ask to pre-qualify leads?",
			answer:
				"You can configure a custom script with questions relevant to your business. For real estate, this could include questions about their budget, desired property type, buying/selling timeframe, if they're working with an agent, etc.",
		},
		{
			question: "How does the chatbot hand over leads to my sales team?",
			answer:
				"Qualified leads and their conversation history are automatically synced to your Deal Scale CRM. The chatbot can also be configured to send real-time email/SMS notifications to your team for immediate follow-up, or even attempt a live chat transfer if your agents are available.",
		},
		{
			question:
				"Can the AI chatbot book appointments directly into our calendar?",
			answer:
				"Yes, if you integrate your calendar (e.g., Google Calendar, Outlook Calendar) with Deal Scale, the AI chatbot can offer available time slots and book appointments directly for qualified leads.",
		},
		{
			question:
				"What happens if the chatbot can't answer a specific visitor question?",
			answer:
				"You can configure fallback responses. Typically, the chatbot will offer to connect the visitor with a human agent, take their contact details for a follow-up, or direct them to relevant resources on your website.",
		},
	],
};

export const aiOutboundQualificationFAQ: FAQProps = {
	title: "AI Outbound Qualification & Scheduling FAQs",
	subtitle: "Discover how our AI can supercharge your outbound sales efforts.",
	faqItems: [
		// Renamed from 'items' to 'faqItems'
		{
			question: "What channels does the AI use for outbound outreach?",
			answer:
				"Our AI Outbound Agent primarily utilizes AI-powered voice calls and intelligent SMS messages to connect with and qualify your leads, offering a multi-touch approach.",
		},
		{
			question: "How does the AI know how to qualify my specific leads?",
			answer:
				"During setup, you define your ideal customer profile and provide specific qualification questions, criteria, and even sample conversation scripts. The AI is then configured to use this logic during its interactions.",
		},
		{
			question: "What is a 'hot transfer' and how does it work?",
			answer:
				"A hot transfer is when the AI, after qualifying a lead and sensing high intent, immediately attempts to connect that live lead to an available human sales agent via a phone call, ensuring no momentum is lost.",
		},
		{
			question:
				"Can the AI book appointments in multiple sales reps' calendars?",
			answer:
				"Yes, you can integrate multiple calendars and set up rules for round-robin or criteria-based assignment, so the AI books appointments with the appropriate sales representative.",
		},
		{
			question: "How natural do the AI voice calls sound?",
			answer:
				"We use advanced text-to-speech and conversational AI technology to make the AI voice sound as natural and human-like as possible, aiming for smooth and engaging conversations.",
		},
		{
			question:
				"What happens if a lead is not qualified or doesn't want to proceed?",
			answer:
				"The AI will disposition the lead accordingly (e.g., 'Not Interested', 'Nurture', 'Wrong Number'). This information is synced to your CRM, and leads can be added to DNC lists or longer-term nurturing campaigns as per your rules.",
		},
	],
};

export const aiDirectMailFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle:
		"Learn how Deal Scale's AI can transform your direct mail campaigns into a lookalike audience expansion machine inspired by How to Win Friends and Influence People.",
	faqItems: [
		{
			question: "How does the pricing work?",
			answer:
				"Our model is simple. You pay a predictable, flat-rate price for each mailer you send. Separately, you purchase 'AI Credits' to use for value-add services like generating personalized content, skip tracing owner data, or having our AI qualify inbound leads.",
		},
		{
			question: "Who prints and sends the mail?",
			answer:
				"We do. Deal Scale operates a proprietary network of national mailing centers and technology to ensure high-quality printing, data management, and timely delivery for all our clients' campaigns. We handle everything in-house.",
		},
		{
			question: "What are AI Credits used for?",
			answer:
				"You have full control. Use credits for: \n1. **AI Mailer Personalization** (1 credit per mail piece) \n2. **AI Lead Qualification** (5 credits when our AI engages a responding lead) \n3. **Skip Tracing** (10 credits for each successful owner data match). Credits never expire.",
		},
	],
};
export const aiInboundFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle:
		"Find answers to common questions about our AI Inbound Call Qualification Agent.",
	faqItems: [
		{
			question: "How does the pricing work?",
			answer:
				"Our model is simple. You pay a low, flat monthly fee for your dedicated AI-powered phone number. Then, you use flexible 'AI Credits' to pay for the time the AI is actively engaged on a call (2 credits per minute). There are no hidden fees.",
		},
		{
			question: "Can I use my existing business phone number?",
			answer:
				"Yes, absolutely. You can simply forward your existing business line to your new Deal Scale AI number. Your customers continue to call the number they already know, and our AI handles the rest seamlessly.",
		},
		{
			question: "Can the AI transfer a call to a live person?",
			answer:
				"Yes. You can configure rules for when a live transfer should occur. For example, a caller can request to speak to a human, or the AI can offer to transfer the call to a specific department or team member if it cannot handle the request.",
		},
		{
			question:
				"What happens if a caller has a very specific or complex question?",
			answer:
				"The AI is trained to recognize the limits of its knowledge. If it encounters a question it can't answer, its primary goal is to intelligently route the caller. It can offer to schedule a call with the right expert or perform a hot transfer to a live agent immediately.",
		},
	],
};

export const socialMediaQualificationFAQ: FAQProps = {
	title: "AI Social Media Qualification FAQs",
	subtitle:
		"Find answers to common questions about our AI Social Media Qualification Agent.",
	faqItems: [
		{
			question: "Is this compliant with Meta's (Facebook/Instagram) policies?",
			answer:
				"Yes, 100%. Our system uses the official Meta API for Messenger, which is the approved and compliant way to build messaging automations. Your account's safety is our top priority.",
		},
		{
			question: "Can the AI reply to comments on my posts and ads?",
			answer:
				"Absolutely. You can configure the agent to post a public reply to a comment (e.g., 'Thanks, I've just sent you a DM!') and simultaneously initiate a private conversation in their direct messages to start the qualification process.",
		},
		{
			question: "How customizable are the automated conversations?",
			answer:
				"Currently, advanced workflow and conversation customizations are only available for our Enterprise members. If you're interested in these features, please contact our team to discuss an upgrade.",
		},
		{
			question: "What happens if a user wants to speak to a real person?",
			answer:
				"Our AI can automatically schedule an appointment with your team or initiate a hot transfer to a live representative, ensuring interested leads are promptly connected to a real person without any manual intervention.",
		},
	],
};

export const textMessageFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle:
		"Find answers to common questions about our AI Text Message Prequalification Agent.",
	faqItems: [
		{
			question: "How does the iMessage (blue bubble) support work?",
			answer:
				"Our proprietary messaging gateway can detect if a recipient is an Apple user. When possible, it delivers the message via the iMessage protocol for a more native and trusted user experience. For all other users, it delivers a standard SMS seamlessly. The AI handles both formats without any change to your workflow.",
		},
		{
			question: "Is this compliant with TCPA regulations?",
			answer:
				"Yes. Compliance is at the core of our platform. We enforce consent protocols, automatically process opt-out requests (e.g., 'STOP'), manage quiet hours, and provide the tools you need to run your campaigns in a fully compliant manner.",
		},
		{
			question: "Can the AI understand complex replies?",
			answer:
				"Yes. It's powered by a natural language processing engine, not simple keywords. It can understand intent, such as positive interest, negative responses, questions, and requests to speak with a human, and will react according to the rules you set.",
		},
	],
};

export const rentEstimatorFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle:
		"Find answers to common questions about the Deal Scale Rent Estimator.",
	faqItems: [
		{
			question: "How accurate is your rental data?",
			answer:
				"Our data is highly accurate. We aggregate information from millions of active listings, Multiple Listing Services (MLS), and proprietary public record data, which is refreshed daily to ensure you have the most current information available.",
		},
		{
			question: "Can I track my entire rental portfolio in one place?",
			answer:
				"Yes. Our Pro and Scale plans include a portfolio dashboard where you can add your existing properties to track their estimated value, rent changes, receive real-time alerts, and analyze historical performance.",
		},
		{
			question: "What areas do you cover?",
			answer:
				"Our platform covers the entire United States, including all 50 states and over 38,000 zip codes. You can look up property data and market trends for any residential property nationwide.",
		},
	],
};

export const marketAnalyzerFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle:
		"Find answers to common questions about the Deal Scale Rental Market Analyzer.",
	faqItems: [
		{
			question: "How is this different from the AI Rent Estimator?",
			answer:
				"The Rent Estimator is for analyzing a *single property address* to find its specific rent value. The Market Analyzer is for analyzing an *entire zip code* to understand broad market trends, averages, and investment potential.",
		},
		{
			question: "Where does your data come from?",
			answer:
				"Our data is aggregated from millions of active listings, Multiple Listing Services (MLS), and proprietary public record data. Our system updates over 500,000 property records daily to ensure the highest accuracy.",
		},
		{
			question: "Can I use this to find specific properties for sale?",
			answer:
				"This tool is designed for analyzing the health of a market. Once you identify a promising zip code, you can use our other Deal Scale tools, like Lookalike Audience Expansion, to find specific on-market and off-market properties within that area.",
		},
	],
};

export const portfolioDashboardFAQ: FAQProps = {
	title: "Frequently Asked Questions",
	subtitle:
		"Find answers to common questions about the Enterprise Portfolio Dashboard.",
	faqItems: [
		{
			question:
				"How does your system handle data security for a large portfolio?",
			answer:
				"Security is our top priority. Our platform uses industry-standard encryption for data at rest and in transit. Our Enterprise tier also offers features like Single Sign-On (SSO) and role-based access control to ensure users only see the data relevant to them.",
		},
		{
			question:
				"Can this dashboard integrate with our existing accounting or property management software?",
			answer:
				"Yes. Our Enterprise plan includes API access, allowing you to create custom integrations to sync data between Deal Scale and your existing systems like Yardi, AppFolio, or your internal accounting software.",
		},
		{
			question:
				"Is there a limit to the number of properties or users we can have?",
			answer:
				"Our platform is built to scale. The Enterprise plan is designed for large portfolios and includes unlimited property tracking and custom user seats to fit your organization's structure.",
		},
	],
};
