import { companyData } from "@/data/company";
import { Mail, Phone } from "lucide-react";

export function ContactInfo() {
	return (
		<div className="my-12 rounded-xl border border-white/10 bg-background-dark/90 p-6 backdrop-blur-sm">
			<div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
				<div className="flex items-center gap-3">
					<Mail className="h-5 w-5 text-primary" />
					<a
						href="mailto:contact@dealscale.io"
						className="text-black transition-colors hover:text-primary dark:text-white"
					>
						{companyData.contactInfo.email}{" "}
					</a>
				</div>

				<div className="flex items-center gap-3">
					<Phone className="h-5 w-5 text-primary" />
					<a
						href="tel:+1234567890"
						className="text-black transition-colors hover:text-primary dark:text-white"
					>
						{companyData.contactInfo.phone}
					</a>
				</div>
			</div>
		</div>
	);
}
