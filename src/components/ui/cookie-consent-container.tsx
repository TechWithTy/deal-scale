/**
 * @deprecated Use `IntentModal` with `intent="cookie-consent"` instead.
 * This component is kept for backward compatibility but will be removed in a future version.
 */
"use client";

import { IntentModal, type IntentModalProps } from "./intent-modal";

export interface CookieConsentContainerProps
	extends Omit<IntentModalProps, "intent"> {
	// Legacy props maintained for backward compatibility
}

/**
 * @deprecated Use `IntentModal` with `intent="cookie-consent"` instead.
 * A flexible cookie-consent shell that can render inline, as a modal, or as a bottom drawer.
 * The component does not manage business logic; wire the `open` state and callbacks from the parent.
 */
export function CookieConsentContainer({
	title = "We use cookies",
	...props
}: CookieConsentContainerProps) {
	return <IntentModal intent="cookie-consent" title={title} {...props} />;
}
