"use client";

import HeroSessionMonitor from "./HeroSessionMonitor";

import type { HeroSessionMonitorProps } from "./HeroSessionMonitor";

export default function HeroSessionMonitorClient(
	props: HeroSessionMonitorProps,
) {
	return <HeroSessionMonitor {...props} />;
}
