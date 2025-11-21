import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownContentProps {
	content: string;
	className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
	return (
		<article
			className={cn(
				"prose dark:prose-invert max-w-none text-foreground leading-relaxed",
				className,
			)}
		>
			<ReactMarkdown
				components={{
					code({ node, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || "");
						return node.tagName === "code" && match ? (
							<SyntaxHighlighter
								style={oneDark}
								language={match[1]}
								PreTag="div"
								{...props}
							>
								{String(children).replace(/\n$/, "")}
							</SyntaxHighlighter>
						) : (
							<code className={className} {...props}>
								{children}
							</code>
						);
					},
					p: ({ node, ...props }) => <p className="my-4" {...props} />,
					h1: ({ node, ...props }) => (
						<h1 className="my-6 text-center font-bold text-4xl" {...props} />
					),
					h2: ({ node, ...props }) => (
						<h2
							className="my-5 text-center font-semibold text-3xl"
							{...props}
						/>
					),
					h3: ({ node, ...props }) => (
						<h3 className="my-4 font-medium text-2xl" {...props} />
					),
					ul: ({ node, ...props }) => (
						<ul className="my-4 list-inside list-disc" {...props} />
					),
					ol: ({ node, ...props }) => (
						<ol className="my-4 list-inside list-decimal" {...props} />
					),
					blockquote: ({ node, ...props }) => (
						<blockquote
							className="my-4 border-gray-300 border-l-4 pl-4 italic"
							{...props}
						/>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</article>
	);
}
