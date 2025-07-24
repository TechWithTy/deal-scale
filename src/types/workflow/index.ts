// Request body for adding/removing a contact from a workflow
export type WorkflowRequest = {
	eventStartTime?: string; // Optional, only needed for adding to a workflow
};

// Response type for adding/removing a contact from a workflow
export type WorkflowActionResponse = {
	succeeded: boolean;
};

export type Workflow = {
	id: string; // Workflow ID
	name: string; // Name of the workflow
	status: string; // Status of the workflow (e.g., draft, active)
	version: number; // Version number of the workflow
	createdAt: string; // ISO date string representing when the workflow was created
	updatedAt: string; // ISO date string representing when the workflow was last updated
	locationId: string; // Location ID associated with the workflow
	dealScaleMetadata?: Record<string, unknown>; // Dynamic attribute with key
};

export type GetWorkflowResponse = {
	workflows: Workflow[]; // Array of Workflow objects
};

export const exampleGetWorkflowResponse: GetWorkflowResponse = {
	workflows: [
		{
			id: "78559bb3-b920-461e-b010-7b2a2816d2a9",
			name: "First Workflow",
			status: "draft",
			version: 2,
			createdAt: "2021-05-26T11:33:49.000Z",
			updatedAt: "2021-05-26T11:33:49.000Z",
			locationId: "eBG6WapS3v4ZqwA45MTxtYJ",
		},
	],
};
