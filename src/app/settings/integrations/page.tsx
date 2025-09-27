export default function SettingsIntegrationsPage() {
	return (
		<main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
			<h1 className="text-3xl font-semibold">Social Integrations</h1>
			<p className="text-muted-foreground text-base">
				Review the result of your social OAuth connections. We will show success or
				error messages after you return from LinkedIn or Facebook.
			</p>
			<p className="text-sm text-muted-foreground">
				If you were redirected here unexpectedly, please try connecting again or
				contact support.
			</p>
		</main>
	);
}
