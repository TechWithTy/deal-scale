export type EventPageParams = {
	slug: string;
};

export type EventPageParamsInput = EventPageParams | Promise<EventPageParams>;

export class ResolveEventParamsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ResolveEventParamsError";
	}
}

export async function resolveEventParams(
	params: EventPageParamsInput,
): Promise<EventPageParams> {
	try {
		const resolved = await params;
		const slug = resolved?.slug?.trim();

		if (!slug) {
			throw new ResolveEventParamsError("Missing event slug");
		}

		return { slug };
	} catch (error) {
		if (error instanceof ResolveEventParamsError) {
			throw error;
		}

		throw new ResolveEventParamsError("Failed to resolve event params");
	}
}
