import {
	SchemaInjector,
	buildOrganizationSchema,
	buildWebSiteSchema,
} from "@/utils/seo/schema";

export default function Head() {
	const organizationSchema = buildOrganizationSchema();
	const webSiteSchema = buildWebSiteSchema();

	return (
		<>
			<link
				rel="preconnect"
				href="https://js.stripe.com"
				crossOrigin="anonymous"
			/>
			<link
				rel="preconnect"
				href="https://m.stripe.network"
				crossOrigin="anonymous"
			/>
			<link
				rel="preconnect"
				href="https://js.zohocdn.com"
				crossOrigin="anonymous"
			/>
			<SchemaInjector schema={organizationSchema} />
			<SchemaInjector schema={webSiteSchema} />
		</>
	);
}
