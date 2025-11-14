import { useEffect, useState, useCallback, useRef } from "react";
import Cookies from "js-cookie";

export * from "./types";

import {
	contexts,
	isMobile,
	isDesktop,
	createDebounce,
	defaultSettings,
	createIdleEvents,
	removeIdleEvents,
	secondsToMiliseconds,
	processHandlersByDeviceContext,
} from "./utils";

import type {
	ExitIntentHandler,
	ExitIntentSettings,
	InternalExitIntentSettings,
} from "./types";

const truthyValues = new Set(["1", "true", "on", "yes"]);
const debugEnabled = () =>
	truthyValues.has(
		(process.env.NEXT_PUBLIC_EXIT_INTENT_DEBUG ?? "false").trim().toLowerCase(),
	);

const log = (event: string, details?: Record<string, unknown>) => {
	if (!debugEnabled()) return;

	if (details) {
		// eslint-disable-next-line no-console
		console.info("[use-exit-intent]", event, details);
	} else {
		// eslint-disable-next-line no-console
		console.info("[use-exit-intent]", event);
	}
};

type UseExitIntentProps = ExitIntentSettings;

export function useExitIntent(props?: UseExitIntentProps) {
	const {
		cookie: cookieOverrides,
		desktop: desktopOverrides,
		mobile: mobileOverrides,
	} = props ?? {};

	const buildInitialSettings = useCallback(
		(): InternalExitIntentSettings => ({
			...defaultSettings,
			cookie: {
				...defaultSettings.cookie,
				...(cookieOverrides || {}),
			},
			desktop: {
				...defaultSettings.desktop,
				...(desktopOverrides || {}),
			},
			mobile: {
				...defaultSettings.mobile,
				...(mobileOverrides || {}),
			},
		}),
		[cookieOverrides, desktopOverrides, mobileOverrides],
	);

	const [settings, setSettings] = useState<InternalExitIntentSettings>(() =>
		buildInitialSettings(),
	);

	useEffect(() => {
		log("settings:applied", { settings });
	}, [settings]);

	const [isTriggered, setIsTriggered] = useState(false);
	const [isUnsubscribed, setIsUnsubscribed] = useState(false);

	const handlersRef = useRef<ExitIntentHandler[]>([]);
	const shouldNotTrigger = useRef<boolean>(false);
	const snoozeUntilRef = useRef<number | null>(null);

	const { mobile: settingsMobile, desktop: settingsDesktop, cookie } = settings;
	const willBeTriggered = !(isUnsubscribed || isTriggered);

	shouldNotTrigger.current = isUnsubscribed || isTriggered;

	const mobileDelaySeconds =
		settingsMobile?.delayInSecondsToTrigger ??
		defaultSettings.mobile.delayInSecondsToTrigger;
	const mobileTriggerOnIdle =
		settingsMobile?.triggerOnIdle ?? defaultSettings.mobile.triggerOnIdle;

	const desktopDelaySeconds =
		settingsDesktop?.delayInSecondsToTrigger ??
		defaultSettings.desktop.delayInSecondsToTrigger;
	const desktopMouseLeaveDelaySeconds =
		settingsDesktop?.mouseLeaveDelayInSeconds ??
		defaultSettings.desktop.mouseLeaveDelayInSeconds;
	const desktopTriggerOnIdle =
		settingsDesktop?.triggerOnIdle ?? defaultSettings.desktop.triggerOnIdle;
	const desktopTriggerOnMouseLeave =
		settingsDesktop?.triggerOnMouseLeave ??
		defaultSettings.desktop.triggerOnMouseLeave;
	const desktopUseBeforeUnload =
		settingsDesktop?.useBeforeUnload ?? defaultSettings.desktop.useBeforeUnload;

	const handleExitIntent = useCallback(() => {
		if (shouldNotTrigger.current) {
			log("trigger:blocked");
			return;
		}

		if (snoozeUntilRef.current && Date.now() < snoozeUntilRef.current) {
			log("trigger:snoozed", {
				remainingMs: snoozeUntilRef.current - Date.now(),
			});
			return;
		}

		log("trigger:open");
		setIsTriggered(true);

		for (const handler of handlersRef.current) {
			const contextsForHandler = handler.context ?? [];
			const isDefault =
				contextsForHandler.filter(
					(context) =>
						context !== contexts.onDesktop && context !== contexts.onMobile,
				).length === 0;

			if (isDefault || contextsForHandler.includes(contexts.onTrigger)) {
				log("handler:invoke", { id: handler.id, context: contextsForHandler });
				processHandlersByDeviceContext(handler);
			}
		}
	}, []);

	const unsubscribe = useCallback(() => {
		log("unsubscribe", { cookie: cookie.key });
		Cookies.set(cookie.key, "true", {
			expires: cookie.daysToExpire,
			sameSite: "Strict",
		});

		for (const handler of handlersRef.current) {
			if (handler.context?.includes(contexts.onUnsubscribe)) {
				log("handler:unsubscribe", {
					id: handler.id,
					context: handler.context,
				});
				processHandlersByDeviceContext(handler);
			}
		}

		setIsUnsubscribed(true);
	}, [cookie.daysToExpire, cookie.key]);

	const resetState = useCallback(() => {
		log("state:reset");
		Cookies.remove(cookie.key, { sameSite: "Strict" });
		window.onbeforeunload = null;

		setIsTriggered(false);
		setIsUnsubscribed(false);
	}, [cookie.key]);

	const resetSettings = useCallback(() => {
		log("settings:reset");
		resetState();
		setSettings(buildInitialSettings());
	}, [buildInitialSettings, resetState]);

	const registerHandler = useCallback((handler: ExitIntentHandler) => {
		const handlers = handlersRef.current;
		const handlerAlreadyPushed = handlers.find(
			(registeredHandler) => registeredHandler.id === handler.id,
		);
		log("handler:register", { id: handler.id, context: handler.context });

		const normalizedHandler: ExitIntentHandler = {
			...handler,
			context: handler?.context || [],
		};

		if (handlerAlreadyPushed) {
			const index = handlers.indexOf(handlerAlreadyPushed);
			handlers[index] = normalizedHandler;
			return;
		}
		handlers.push(normalizedHandler);
	}, []);

	const updateSettings = useCallback(
		(nextSettings: ExitIntentSettings = {}) => {
			log("settings:update-request", { settings: nextSettings });
			resetState();

			setSettings((previousSettings) => {
				const nextCookie = {
					...defaultSettings.cookie,
					...previousSettings.cookie,
					...(nextSettings.cookie ?? {}),
				};

				const nextDesktop = {
					...defaultSettings.desktop,
					...previousSettings.desktop,
					...(nextSettings.desktop ?? {}),
				};

				const nextMobile = {
					...defaultSettings.mobile,
					...previousSettings.mobile,
					...(nextSettings.mobile ?? {}),
				};

				log("settings:update-applied", {
					cookie: nextCookie,
					desktop: nextDesktop,
					mobile: nextMobile,
				});

				snoozeUntilRef.current = null;

				const mergedSettings: InternalExitIntentSettings = {
					cookie: nextCookie,
					desktop: nextDesktop,
					mobile: nextMobile,
				};

				return mergedSettings;
			});
		},
		[resetState],
	);

	useEffect(() => {
		setIsUnsubscribed(Cookies.get(cookie.key) === "true");
	}, [cookie.key]);

	useEffect(() => {
		log("listeners:register", {
			desktop: {
				delaySeconds: desktopDelaySeconds,
				triggerOnIdle: desktopTriggerOnIdle,
				triggerOnMouseLeave: desktopTriggerOnMouseLeave,
				useBeforeUnload: desktopUseBeforeUnload,
			},
			mobile: {
				delaySeconds: mobileDelaySeconds,
				triggerOnIdle: mobileTriggerOnIdle,
			},
		});
		const cleanups: Array<() => void> = [];

		if (isMobile()) {
			const { execute, abort } = createDebounce(
				handleExitIntent,
				secondsToMiliseconds(mobileDelaySeconds),
			);

			if (shouldNotTrigger.current) {
				removeIdleEvents(execute);
			} else if (mobileTriggerOnIdle) {
				createIdleEvents(execute);
			}

			cleanups.push(() => {
				abort();
				removeIdleEvents(execute);
			});
		}

		if (isDesktop()) {
			const { execute, abort } = createDebounce(
				handleExitIntent,
				secondsToMiliseconds(desktopDelaySeconds),
			);

			let mouseLeaveTimer: ReturnType<typeof setTimeout> | undefined;

			const handleMouseLeave = () => {
				if (shouldNotTrigger.current) return;
				handleExitIntent();
			};

			if (desktopTriggerOnIdle) {
				createIdleEvents(execute);
			}

			if (desktopTriggerOnMouseLeave) {
				mouseLeaveTimer = setTimeout(() => {
					document.body.addEventListener("mouseleave", handleMouseLeave);
				}, secondsToMiliseconds(desktopMouseLeaveDelaySeconds));
			}

			if (desktopUseBeforeUnload) {
				window.onbeforeunload = () => {
					if (shouldNotTrigger.current) return;

					handleExitIntent();

					return "";
				};
			}

			cleanups.push(() => {
				abort();
				if (mouseLeaveTimer) {
					clearTimeout(mouseLeaveTimer);
				}
				document.body.removeEventListener("mouseleave", handleMouseLeave);
				removeIdleEvents(execute);
				window.onbeforeunload = null;
			});
		}

		return () => {
			log("listeners:cleanup");
			for (const cleanup of cleanups) {
				cleanup();
			}
		};
	}, [
		handleExitIntent,
		mobileDelaySeconds,
		mobileTriggerOnIdle,
		desktopDelaySeconds,
		desktopMouseLeaveDelaySeconds,
		desktopTriggerOnIdle,
		desktopTriggerOnMouseLeave,
		desktopUseBeforeUnload,
	]);

	return {
		settings,
		resetState,
		isTriggered,
		unsubscribe,
		resetSettings,
		updateSettings,
		isUnsubscribed,
		registerHandler,
		willBeTriggered,
	};
}
