"use client";

import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type AffiliateStatus =
	| "pending"
	| "approved"
	| "active"
	| "suspended"
	| "rejected";

interface AffiliatePendingApprovalProps {
	status: AffiliateStatus | null;
	onRefetch?: () => Promise<void>;
}

export default function AffiliatePendingApproval({
	status,
	onRefetch,
}: AffiliatePendingApprovalProps) {
	const getStatusMessage = () => {
		switch (status) {
			case "pending":
				return {
					title: "Application Under Review",
					subtitle:
						"We're reviewing your affiliate application. You'll receive an email notification once a decision has been made.",
					icon: "⏳",
					description:
						"Thank you for your interest in becoming a Deal Scale affiliate. Our team is carefully reviewing your application and will get back to you soon.",
				};
			case "rejected":
				return {
					title: "Application Not Approved",
					subtitle:
						"Unfortunately, we're unable to approve your affiliate application at this time.",
					icon: "❌",
					description:
						"If you have questions about this decision, please contact our support team. You may reapply in the future if your circumstances change.",
				};
			case "suspended":
				return {
					title: "Account Suspended",
					subtitle: "Your affiliate account has been temporarily suspended.",
					icon: "⚠️",
					description:
						"Please contact our support team to resolve this issue and restore your account access.",
				};
			default:
				return {
					title: "Application Status",
					subtitle: "Checking your application status...",
					icon: "📋",
					description: "Please wait while we check your application status.",
				};
		}
	};

	const message = getStatusMessage();

	return (
		<div className="relative mx-auto max-w-2xl rounded-2xl border border-primary/40 bg-gradient-to-br from-white via-background to-primary-50 p-6 shadow-xl ring-1 ring-primary/10 transition-all sm:p-10 dark:from-background dark:via-background-dark dark:to-primary/10">
			<div className="-z-10 absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-focus/10 opacity-60 blur-lg dark:from-primary/30 dark:to-focus/20" />
			<Header
				title={message.title}
				subtitle={message.subtitle}
				size="sm"
				className="mb-8 md:mb-12"
			/>

			<div className="flex flex-col items-center justify-center space-y-6 text-center">
				<div className="text-6xl">{message.icon}</div>
				<p className="text-base text-muted-foreground leading-relaxed">
					{message.description}
				</p>

				{status === "pending" && (
					<div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
						<p className="font-medium text-primary text-sm">
							💡 Tip: Check your email for updates. We typically review
							applications within 2-3 business days.
						</p>
					</div>
				)}

				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
					{onRefetch && (
						<Button
							variant="outline"
							onClick={() => {
								void onRefetch();
							}}
						>
							Refresh Status
						</Button>
					)}
					<Button asChild variant="default">
						<Link href="/affiliate">View Application</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}


