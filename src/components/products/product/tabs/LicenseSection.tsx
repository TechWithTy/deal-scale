import { licenses } from "@/data/products/license";

import type { LicenseType } from "@/types/products";

interface LicenseSectionProps {
	licenseName?: LicenseType;
}
// licenseName now expects a LicenseType enum, not a string.

const LicenseSection = ({ licenseName }: LicenseSectionProps) => {
	if (!licenseName) return null;
	const license = licenses.find((l) => l.type === licenseName);
	if (!license) return null;
	return (
		<section className="my-8 rounded-md border border-muted bg-muted/40 p-4">
			<h3 className="mb-2 font-semibold text-lg text-primary">License</h3>
			<p className="mb-1">
				<a
					href={license.url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline"
				>
					{license.name}
				</a>
			</p>
			{license.description && (
				<p className="mb-2 text-black dark:text-white">{license.description}</p>
			)}
			<div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div>
					<h4 className="mb-1 font-medium text-black text-sm dark:text-white">
						Permissions
					</h4>
					<ul className="ml-4 list-disc text-black text-xs dark:text-white">
						{license.permissions.map((perm) => (
							<li key={perm}>{perm}</li>
						))}
					</ul>
				</div>
				<div>
					<h4 className="mb-1 font-medium text-black text-sm dark:text-white">
						Conditions
					</h4>
					<ul className="ml-4 list-disc text-black text-xs dark:text-white">
						{license.conditions.map((cond) => (
							<li key={cond}>{cond}</li>
						))}
					</ul>
				</div>
				<div>
					<h4 className="mb-1 font-medium text-black text-sm dark:text-white">
						Limitations
					</h4>
					<ul className="ml-4 list-disc text-black text-xs dark:text-white">
						{license.limitations.map((lim) => (
							<li key={lim}>{lim}</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default LicenseSection;
