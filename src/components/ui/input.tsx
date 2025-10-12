import * as React from "react";

import { cn } from "@/lib/utils";

/** Matches background related CSS declarations (background, background-image, etc.). */
const BACKGROUND_DECLARATION = /^background(?:-[a-z]+)?$/i;

/**
 * Removes inline background related declarations that browsers and extensions
 * might inject before hydration. Returns the sanitized style string or null
 * when no declarations remain.
 */
export function stripBackgroundStyleDeclarations(styleValue: string): string | null {
        const declarations = styleValue
                .split(";")
                .map((declaration) => declaration.trim())
                .filter(Boolean)
                .filter((declaration) => {
                        const [property] = declaration.split(":");
                        if (!property) {
                                return false;
                        }
                        return !BACKGROUND_DECLARATION.test(property.trim());
                });

        if (declarations.length === 0) {
                return null;
        }

        return declarations.join("; ");
}

function applyRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
        if (!ref) {
                return;
        }

        if (typeof ref === "function") {
                ref(value);
        } else {
                (ref as React.MutableRefObject<T | null>).current = value;
        }
}

function sanitizeNodeBackground(node: HTMLInputElement) {
        const styleValue = node.getAttribute("style");
        if (!styleValue) {
                return;
        }

        const sanitized = stripBackgroundStyleDeclarations(styleValue);
        if (!sanitized) {
                node.removeAttribute("style");
                return;
        }

        if (sanitized === styleValue) {
                return;
        }

        node.setAttribute("style", sanitized);
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
        ({ className, type, ...props }, ref) => {
                const localRef = React.useRef<HTMLInputElement | null>(null);

                const handleRef = React.useCallback(
                        (node: HTMLInputElement | null) => {
                                if (!node) {
                                        localRef.current = null;
                                        applyRef(ref, null);
                                        return;
                                }

                                localRef.current = node;
                                sanitizeNodeBackground(node);
                                applyRef(ref, node);
                        },
                        [ref],
                );

                React.useEffect(() => {
                        if (typeof window === "undefined") {
                                return;
                        }

                        const node = localRef.current;
                        if (!node || typeof MutationObserver === "undefined") {
                                return;
                        }

                        const observer = new MutationObserver(() => {
                                if (!localRef.current) {
                                        return;
                                }
                                sanitizeNodeBackground(localRef.current);
                        });

                        observer.observe(node, { attributes: true, attributeFilter: ["style"] });

                        return () => {
                                observer.disconnect();
                        };
                }, []);

                return (
                        <input
                                type={type}
                                className={cn(
                                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-",
                                        "black ring-offset-background transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text",
                                        "-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring",
                                        "-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:text-white/70",
                                        className,
                                )}
                                ref={handleRef}
                                {...props}
                                suppressHydrationWarning={true}
                        />
                );
        },
);
Input.displayName = "Input";

export { Input };
