import {
	SchemaInjector,
	buildOrganizationSchema,
	buildWebSiteSchema,
	buildDatasetSchema,
	buildSoftwareApplicationSchema,
} from "@/utils/seo/schema";

export default function Head() {
	const organizationSchema = buildOrganizationSchema();
	const webSiteSchema = buildWebSiteSchema();
	const softwareApplicationSchema = buildSoftwareApplicationSchema();
	const datasetSchema = buildDatasetSchema();

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
			<SchemaInjector schema={softwareApplicationSchema} />
			<SchemaInjector schema={datasetSchema} />
		</>
	);
}
