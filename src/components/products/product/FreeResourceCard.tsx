import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { ProductResource, ProductType } from "@/types/products";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";
import { useMemo, useState } from "react";

/** Props for rendering the highlighted free resource card. */
export interface FreeResourceCardProps {
	/** The product metadata describing the free resource. */
	product: ProductType;
}

const CTA_DOWNLOAD_LABEL = "Download Resource";
const CTA_EXTERNAL_LABEL = "Visit Resource";
const CTA_DEMO_LABEL = "View Demo";
const CTA_DETAILS_LABEL = "View Details";

const FreeResourceCard: FC<FreeResourceCardProps> = ({ product }) => {
	const resource = product.resource;
	const [isDemoOpen, setIsDemoOpen] = useState(false);
	const productHref = useMemo(() => {
		if (!product.slug && !product.sku) {
			return null;
		}

		const slugOrSku = product.slug ?? product.sku;
		return `/products/${slugOrSku}`;
	}, [product.slug, product.sku]);

	if (!resource) {
		return null;
	}

	const renderPrimaryCta = (resourceMeta: ProductResource) => {
		if (resourceMeta.type === "download") {
			return (
				<Button asChild size="lg" className="w-full">
					<a
						href={resourceMeta.url}
						download={resourceMeta.fileName ?? true}
						target="_blank"
						rel="noopener noreferrer"
					>
						{CTA_DOWNLOAD_LABEL}
					</a>
				</Button>
			);
		}

		return (
			<Button asChild size="lg" className="w-full">
				<a href={resourceMeta.url} target="_blank" rel="noopener noreferrer">
					{CTA_EXTERNAL_LABEL}
				</a>
			</Button>
		);
	};

	return (
		<article className="relative w-full overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-background via-background to-background/40 shadow-[0_20px_60px_rgba(80,56,237,0.18)]">
			<div className="-right-10 -top-10 pointer-events-none absolute h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
			<div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
				<div className="flex-1 text-left">
					<div className="mb-4 flex items-center gap-2 text-primary">
						<Sparkles className="h-5 w-5" aria-hidden />
						<Badge variant="secondary" className="uppercase tracking-wide">
							Free Resource
						</Badge>
					</div>
					<h3 className="mb-3 font-semibold text-3xl text-primary">
						{productHref ? (
							<Link
								href={productHref}
								className="transition hover:text-primary/80"
							>
								{product.name}
							</Link>
						) : (
							product.name
						)}
					</h3>
					<p className="max-w-2xl text-base text-foreground/80">
						{product.description}
					</p>
					{resource.fileSize && (
						<p className="mt-4 text-foreground/60 text-sm">
							File size: {resource.fileSize}
						</p>
					)}
				</div>
				<div className="flex w-full flex-col items-stretch gap-3 md:max-w-xs">
					{renderPrimaryCta(resource)}
					{resource.demoUrl && (
						<Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
							<DialogTrigger asChild>
								<Button variant="outline" size="lg" type="button">
									{CTA_DEMO_LABEL}
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-3xl">
								<DialogHeader>
									<DialogTitle>{product.name} Demo</DialogTitle>
									<DialogDescription>
										See how to get the most value from this resource in just a
										couple of minutes.
									</DialogDescription>
								</DialogHeader>
								<div className="aspect-video w-full overflow-hidden rounded-xl">
									<iframe
										title={`${product.name} demo`}
										src={resource.demoUrl}
										className="h-full w-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							</DialogContent>
						</Dialog>
					)}
					{productHref && (
						<Button variant="ghost" size="lg" asChild>
							<Link href={productHref}>{CTA_DETAILS_LABEL}</Link>
						</Button>
					)}
				</div>
			</div>
		</article>
	);
};

export default FreeResourceCard;
