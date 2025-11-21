"use client";

import { useEffect } from "react";

let waitCursorUsers = 0;

export function useWaitCursor(active: boolean) {
	useEffect(() => {
		if (!active || typeof document === "undefined") {
			return;
		}

		waitCursorUsers += 1;
		const previousCursor = document.body.style.cursor;
		document.body.style.cursor = "wait";

		return () => {
			waitCursorUsers = Math.max(0, waitCursorUsers - 1);
			if (waitCursorUsers === 0) {
				document.body.style.cursor = previousCursor || "";
			}
		};
	}, [active]);
}
