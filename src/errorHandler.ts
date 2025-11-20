import { type NextRequest, NextResponse } from "next/server";

type Handler = (req: NextRequest) => Promise<NextResponse>;

type Handlers = {
	[method: string]: Handler;
};

export default function apiHandler(handlers: Handlers) {
	const wrappedHandlers: { [key: string]: Handler } = {};

	for (const method in handlers) {
		wrappedHandlers[method] = async (req: NextRequest) => {
			try {
				return await handlers[method](req);
			} catch (error) {
				// Log error and return a standard error response
				console.error("[API Error]", error);
				return NextResponse.json(
					{
						success: false,
						message: error instanceof Error ? error.message : "Unknown error",
					},
					{ status: 500 },
				);
			}
		};
	}

	return wrappedHandlers;
}
