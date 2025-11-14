export const FOUNDERS_CIRCLE_DEADLINE = Date.UTC(2025, 11, 15, 23, 59, 59);
export const FOUNDERS_CIRCLE_DEADLINE_ISO = new Date(FOUNDERS_CIRCLE_DEADLINE).toISOString();
export const FOUNDERS_CIRCLE_DEADLINE_LABEL = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(FOUNDERS_CIRCLE_DEADLINE));
