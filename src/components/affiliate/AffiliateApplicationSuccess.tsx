"use client";

import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AffiliateApplicationSuccess() {
	return (
		<div className="mx-auto flex max-w-xl flex-col items-center justify-center py-16 text-center">
			<Header
				title="Application Submitted!"
				subtitle="We'll review your application and get back to you soon."
				size="md"
				className="mb-6"
			/>

			<div className="mb-8 flex flex-col items-center justify-center gap-4">
				<div className="text-6xl">✅</div>
				<div className="space-y-2">
					<p className="text-base text-muted-foreground leading-relaxed">
						Thank you for your interest in becoming a Deal Scale affiliate. Our
						team is carefully reviewing your application.
					</p>
					<p className="text-muted-foreground text-sm">
						You'll receive an email notification once a decision has been made,
						typically within 2-3 business days.
					</p>
				</div>

				<div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
					<p className="font-medium text-primary text-sm">💡 What's Next?</p>
					<ul className="mt-2 space-y-1 text-left text-muted-foreground text-sm">
						<li>• Check your email for confirmation</li>
						<li>• We'll review your application</li>
						<li>
							• If approved, you'll receive a link to complete payment setup
						</li>
						<li>• Then you can start earning commissions!</li>
					</ul>
				</div>
			</div>

			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
				<Button asChild variant="default">
					<Link href="/">Return to Home</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/contact">Contact Support</Link>
				</Button>
			</div>
		</div>
	);
}


