import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useState, type RefObject } from "react";

import { intersection, codes } from "shared/constants";
import { useElementIntersection } from "hooks";

import {
	Title,
	Header,
	Section,
	Description,
	FeatureCard,
	CodeContainer,
} from "./styles";

import { codeTheme } from "styles";

type CodeStateVariants = "0" | "1" | "2" | "3" | "4";
type CodeExampleKeys = keyof typeof codes.overview;
type LIEvent = React.SyntheticEvent<HTMLLIElement>;

export function OverviewSection() {
	const { ref, onIntersect } = useElementIntersection<HTMLDivElement>(
		intersection.options,
	);

	const [codeExampleVariant, setCodeExampleVariant] =
		useState<CodeStateVariants>("0");

	const [codeExample, setCodeExample] = useState<CodeExampleKeys>("default");

	onIntersect("overview", ({ element }) => {
		if (element?.id) {
			history.replaceState(null, "", `#${element.id}`);
		}
	});

	function handleDefaultCodeExample() {
		setCodeExample("default");
		setCodeExampleVariant("0");
	}

	function handleCodeExample(event: LIEvent) {
		setCodeExampleVariant(
			(event.currentTarget.dataset.id as CodeStateVariants) || "0",
		);
	}

	function handleConfigurableCodeExample(event: LIEvent) {
		setCodeExample("config");
		handleCodeExample(event);
	}

	return (
		<Section id="overview" ref={ref as RefObject<HTMLDivElement>}>
			<Header>
				<Title>Simple to use</Title>

				<Description>
					The Exit Intent strategy is a great way to increase your conversion
					rate. That strategy is commonly used to show a modal/popup when the
					user is about to leave your website.
				</Description>

				<Description>
					<strong>useExitIntent</strong> hook is simple to use and you can
					customize it to your needs. Just import it and call it in your
					component as in the example on the right.{" "}
					<strong>Here are the main features</strong>:
				</Description>

				<FeatureCard
					data-id="1"
					tabIndex={0}
					onFocus={handleCodeExample}
					onBlur={handleDefaultCodeExample}
					onMouseEnter={handleCodeExample}
					onMouseLeave={handleDefaultCodeExample}
				>
					🚀 Multiple handlers can be registred
				</FeatureCard>

				<FeatureCard
					data-id="2"
					tabIndex={0}
					onFocus={handleConfigurableCodeExample}
					onBlur={handleDefaultCodeExample}
					onMouseEnter={handleConfigurableCodeExample}
					onMouseLeave={handleDefaultCodeExample}
				>
					🔥 Highly configurable
				</FeatureCard>

				<FeatureCard
					data-id="3"
					tabIndex={0}
					onFocus={handleCodeExample}
					onBlur={handleDefaultCodeExample}
					onMouseEnter={handleCodeExample}
					onMouseLeave={handleDefaultCodeExample}
				>
					🧠 Different strategies for Desktop and Mobile
				</FeatureCard>

				<FeatureCard
					data-id="4"
					tabIndex={0}
					onFocus={handleCodeExample}
					onBlur={handleDefaultCodeExample}
					onMouseEnter={handleCodeExample}
					onMouseLeave={handleDefaultCodeExample}
				>
					⛔️ Unsubscription support with cookies
				</FeatureCard>

				<FeatureCard>🎉 Built with TypeScript</FeatureCard>
			</Header>

			<CodeContainer exampleState={codeExampleVariant}>
				<SyntaxHighlighter language="tsx" style={codeTheme}>
					{codes.overview[codeExample]}
				</SyntaxHighlighter>
			</CodeContainer>
		</Section>
	);
}
