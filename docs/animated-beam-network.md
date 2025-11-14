# Animated Beam Network Component

## Overview

`AnimatedBeamNetwork` combines the Magic UI animated beam utility with Aceternity-inspired ambient lighting to highlight cross-platform integrations. The component ships with ready-to-use defaults and can be customized by passing your own integration nodes or copy.

## Usage

```tsx
import { AnimatedBeamNetwork } from "@/components/ui/animated-beam-network";
import { Slack, Webhook } from "lucide-react";

const Example = () => (
	<AnimatedBeamNetwork
		title="Route Signals Instantly"
		description="Keep the revenue team aligned with real-time handoffs across your CRM, messaging, and data warehouse."
		centerLabel="DealScale AI"
		nodes={[
			{
				id: "slack",
				label: "Slack",
				icon: <Slack className="h-5 w-5 text-sky-500" />,
			},
			{
				id: "webhook",
				label: "Webhook",
				icon: <Webhook className="h-5 w-5 text-emerald-400" />,
			},
		]}
	/>
);
```

### Props

- `title`: Optional heading displayed above the network (defaults to *Integrations on Autopilot*).
- `description`: Supporting copy beneath the heading.
- `centerLabel`: Text rendered inside the central DealScale hub.
- `nodes`: Up to six integration nodes. Omitting this prop falls back to curated platform icons.
- `className`: Tailwind classes to compose with the root container.

### Accessibility

Each integration circle exposes its label through `aria-label` and renders a visible caption beneath the badge, ensuring the animated beams remain screen-reader friendly.




