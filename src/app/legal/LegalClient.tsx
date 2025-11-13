"use client";

import { MarkdownContent } from "@/components/legal/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type LegalDocument,
	type LegalDocumentSource,
	legalDocuments,
} from "@/data/legal/legalDocuments";
import { resolveLegalDocumentCanonical } from "@/utils/seo/legalSeo";
import { Copy } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const STATUS_META: Record<
	Exclude<LegalDocumentSource, undefined>,
	{ badgeText: string; helperText: string; badgeClassName: string }
> = {
	live: {
		badgeText: "Live Template",
		helperText: "Synced from the Deal Scale knowledge base.",
		badgeClassName: "border-emerald-400/30 bg-emerald-500/10 text-emerald-400",
	},
	fallback: {
		badgeText: "Fallback Template",
		helperText:
			"Showing static backup copy until the live template is published.",
		badgeClassName: "border-muted-foreground/20 bg-muted text-muted-foreground",
	},
};

const resolveSource = (doc: LegalDocument): LegalDocumentSource =>
	doc.source ?? "fallback";

const getTemplateUrl = (doc: LegalDocument): string =>
	resolveLegalDocumentCanonical(doc);

const LegalClient = () => {
	const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const selectedSource = useMemo<LegalDocumentSource | null>(() => {
		if (!selectedDoc) {
			return null;
		}
		return resolveSource(selectedDoc);
	}, [selectedDoc]);

	const handleClose = useCallback(() => {
		setSelectedDoc(null);
	}, []);

	const handleCopy = useCallback(async () => {
		const container = contentRef.current;
		if (!container) {
			toast.error("Unable to copy text. Try again.");
			return;
		}

		const rawText =
			"innerText" in container && typeof container.innerText === "string"
				? container.innerText
				: (container.textContent ?? "");
		const textToCopy = rawText.trim();
		if (!textToCopy) {
			toast.error("There is no text to copy yet.");
			return;
		}

		const clipboard = navigator.clipboard;
		if (!clipboard || typeof clipboard.writeText !== "function") {
			toast.error("Clipboard is unavailable in this browser.");
			return;
		}

		try {
			await clipboard.writeText(textToCopy);
			toast.success("Legal document copied to clipboard.");
		} catch (error) {
			console.error("[LegalClient] Failed to copy document", error);
			toast.error("Unable to copy text. Try again.");
		}
	}, []);

	const selectedSourceMeta = useMemo(() => {
		if (!selectedSource) {
			return null;
		}
		return STATUS_META[selectedSource];
	}, [selectedSource]);

	return (
		<div className="container mx-auto px-6 py-24">
			<div className="mb-12 text-center">
				<h1 className="font-bold text-4xl">Legal Hub</h1>
				<p className="mt-2 text-muted-foreground">
					All our legal documents in one place.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{legalDocuments.map((doc) => {
					const source = resolveSource(doc);
					const status = STATUS_META[source];
					const templateUrl = getTemplateUrl(doc);

					return (
						<Card
							key={doc.slug}
							className="cursor-pointer transition-transform hover:scale-105"
							onClick={() => setSelectedDoc(doc)}
							role="button"
							tabIndex={0}
							onKeyDown={(event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									setSelectedDoc(doc);
								}
							}}
						>
							<CardHeader className="space-y-4">
								<div className="flex items-start justify-between gap-3">
									<CardTitle>{doc.title}</CardTitle>
									<Badge
										variant={source === "live" ? "default" : "secondary"}
										className={`whitespace-nowrap ${status.badgeClassName}`}
									>
										{status.badgeText}
									</Badge>
								</div>
								<CardDescription>{doc.description}</CardDescription>
								<p className="text-muted-foreground text-xs">
									Last updated: {doc.lastUpdated}
								</p>
							</CardHeader>
							{templateUrl && (
								<CardFooter className="pt-0">
									<Button
										asChild
										variant="outline"
										size="sm"
										className="w-full whitespace-nowrap"
										onClick={(event) => event.stopPropagation()}
									>
										<a
											href={templateUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Open template
										</a>
									</Button>
								</CardFooter>
							)}
						</Card>
					);
				})}
			</div>
			{selectedDoc && selectedSourceMeta && selectedSource && (
				<Dialog open onOpenChange={(open) => (!open ? handleClose() : null)}>
					<DialogContent className="max-h-[80vh] space-y-4 overflow-y-auto">
						<DialogHeader className="space-y-4">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="space-y-2">
									<DialogTitle className="text-2xl sm:text-3xl">
										{selectedDoc.title}
									</DialogTitle>
									<DialogDescription className="text-sm">
										Last updated: {selectedDoc.lastUpdated}
									</DialogDescription>
									<p className="text-muted-foreground text-xs sm:text-sm">
										{selectedSourceMeta.helperText}
									</p>
								</div>
								<div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
									<Badge
										variant={
											selectedSource === "live" ? "default" : "secondary"
										}
										className={`whitespace-nowrap ${selectedSourceMeta.badgeClassName}`}
									>
										{selectedSourceMeta.badgeText}
									</Badge>
									{getTemplateUrl(selectedDoc) && (
										<Button
											asChild
											variant="outline"
											size="sm"
											className="flex w-full items-center gap-2 whitespace-nowrap sm:w-auto"
										>
											<a
												href={getTemplateUrl(selectedDoc)}
												target="_blank"
												rel="noopener noreferrer"
											>
												{selectedSource === "live"
													? "Open template"
													: "View live template"}
											</a>
										</Button>
									)}
									<Button
										variant="outline"
										size="sm"
										className="flex w-full items-center gap-2 whitespace-nowrap sm:w-auto"
										onClick={handleCopy}
									>
										<Copy className="h-4 w-4" />
										Copy all
									</Button>
								</div>
							</div>
						</DialogHeader>
						<div ref={contentRef} className="prose dark:prose-invert">
							<MarkdownContent content={selectedDoc.content} />
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};

export default LegalClient;
