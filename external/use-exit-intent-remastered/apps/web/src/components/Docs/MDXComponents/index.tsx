import type { MDXComponents } from "mdx/types.js";
import type {
	ComponentPropsWithoutRef,
	HTMLAttributes,
	ReactNode,
} from "react";

import { Title, Description } from "components/Layout";
import { CodeBox } from "./CodeBox/index.js";
import { SingleTick } from "./styles.js";

type PreProps = HTMLAttributes<HTMLPreElement>;
type CodeProps = ComponentPropsWithoutRef<"code">;
type SpanProps = HTMLAttributes<HTMLSpanElement>;

function extractChildClassName(children: ReactNode): string | undefined {
	const child = Array.isArray(children) ? children[0] : children;

	if (
		typeof child === "object" &&
		child !== null &&
		"props" in child &&
		typeof (child as { props?: { className?: unknown } }).props?.className ===
			"string"
	) {
		return (child as { props?: { className?: string } }).props?.className;
	}

	return undefined;
}

export function createMDXComponents(): MDXComponents {
	return {
		h1: Title,
		p: Description,

		pre: (props: PreProps) => {
			const { children, ...rest } = props;
			const className = extractChildClassName(children);

			if (!className) {
				return (
					<SingleTick {...(rest as unknown as SpanProps)}>
						{children}
					</SingleTick>
				);
			}

			return <pre {...props} />;
		},

		code: (props: CodeProps) => {
			const language = props.className?.replace("language-", "");

			if (!props.className) {
				return <code {...props} />;
			}

			return <CodeBox language={language} {...props} />;
		},
	};
}
