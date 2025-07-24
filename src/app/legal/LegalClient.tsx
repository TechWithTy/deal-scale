"use client";

import { useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import DOMPurify from 'dompurify';
import { legalDocuments, type LegalDocument } from "@/data/legal/legalDocuments";

const LegalClient = () => {
	const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

	return (
		<div className="container mx-auto px-6 py-24">
			<div className="mb-12 text-center">
				<h1 className="font-bold text-4xl">Legal Hub</h1>
				<p className="mt-2 text-muted-foreground">
					All our legal documents in one place.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{legalDocuments.map((doc) => (
					<Card
						key={doc.slug}
						className="cursor-pointer transition-transform hover:scale-105"
						onClick={() => setSelectedDoc(doc)}
					>
						<CardHeader>
							<CardTitle>{doc.title}</CardTitle>
							<CardDescription>{doc.description}</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
			{selectedDoc && (
				<Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
					<DialogContent className="max-h-[80vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>{selectedDoc.title}</DialogTitle>
							<DialogDescription>
								Last updated: {selectedDoc.lastUpdated}
							</DialogDescription>
						</DialogHeader>
						<div
							className="prose dark:prose-invert mt-4"
							dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedDoc.content) }}
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};

export default LegalClient;
