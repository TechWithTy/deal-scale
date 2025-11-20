import { ChevronRight } from "lucide-react";
import Link from "next/link"; // * Use Next.js Link for navigation
import { v4 as uuidv4 } from "uuid";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
	return (
		<nav className="my-4 flex" aria-label="Breadcrumb">
			<ol className="flex items-center space-x-4">
				{items.map((item, index) => (
					<li key={uuidv4()}>
						<div className="flex items-center">
							{index > 0 && (
								<ChevronRight className="mr-4 h-5 w-5 text-muted" />
							)}
							{/* * Use Next.js Link for client-side navigation */}
							{index === items.length - 1 ? (
								<span
									className={
										"cursor-default font-medium text-muted-foreground text-sm"
									}
									aria-current="page"
								>
									{item.label}
								</span>
							) : (
								<Link
									href={item.href}
									className="font-medium text-primary text-sm hover:text-muted-foreground"
								>
									{item.label}
								</Link>
							)}
						</div>
					</li>
				))}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
