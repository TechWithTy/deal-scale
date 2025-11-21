"use client";

import CloserApplicationForm from "@/components/contact/form/CloserApplicationForm";

export default function CloserApplication() {
	return (
		<main className="min-h-screen bg-background-dark py-16">
			<div className="container mx-auto px-6">
				<CloserApplicationForm
					onSuccess={() => {
						// Optionally redirect or show success message
						console.log("Closer application submitted successfully");
					}}
				/>
			</div>
		</main>
	);
}


