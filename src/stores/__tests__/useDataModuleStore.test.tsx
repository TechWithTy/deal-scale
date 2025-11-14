import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { dataManifest } from "@/data/__generated__/manifest";

import { clearDataModuleStores, useDataModule } from "../useDataModuleStore";

describe("useDataModule", () => {
	afterEach(() => {
		clearDataModuleStores();
	});

	it("keeps initial selector fallbacks referentially stable", async () => {
		const manifestEntry = dataManifest["service/services"] as unknown as {
			loader: () => Promise<typeof import("@/data/service/services")>;
		};
		const originalLoader = manifestEntry.loader;
		let resolveModule!: (
			value: Awaited<ReturnType<typeof originalLoader>>,
		) => void;
		const deferredModule = new Promise<
			Awaited<ReturnType<typeof originalLoader>>
		>((resolve) => {
			resolveModule = resolve;
		});

		manifestEntry.loader = () => deferredModule;

		try {
			const { result, rerender } = renderHook(() =>
				useDataModule("service/services", ({ status, data }) => ({
					status,
					services: (data?.services ?? {}) as Record<string, unknown>,
				})),
			);

			await waitFor(() => {
				expect(result.current.status).toBe("loading");
			});

			const loadingServices = result.current.services;

			act(() => {
				rerender();
			});

			expect(result.current.services).toBe(loadingServices);

			await act(async () => {
				resolveModule(await originalLoader());
			});

			await waitFor(() => {
				expect(result.current.status).toBe("ready");
			});
		} finally {
			manifestEntry.loader = originalLoader;
		}
	});

	it("stabilizes selector outputs to prevent redundant re-renders", async () => {
		const renderSpy = vi.fn();

		const { result } = renderHook(() => {
			renderSpy();
			return useDataModule("service/services", ({ status, data }) => ({
				status,
				services: data?.services ?? {},
			}));
		});

		await waitFor(() => {
			expect(result.current.status).toBe("ready");
		});

		const rendersWhenReady = renderSpy.mock.calls.length;

		await act(async () => {
			await Promise.resolve();
		});

		expect(renderSpy.mock.calls.length).toBe(rendersWhenReady);
	});

	it("reuses cached selector snapshots across passive re-renders", async () => {
		const selectorSpy = vi.fn(({ status, data }) => ({
			status,
			hasData: Boolean(data),
		}));

		const { result, rerender } = renderHook(() =>
			useDataModule("service/services", selectorSpy),
		);

		await waitFor(() => {
			expect(result.current.status).toBe("ready");
		});

		const callsAfterReady = selectorSpy.mock.calls.length;
		const stableSelection = result.current;

		act(() => {
			rerender();
		});

		expect(selectorSpy.mock.calls.length).toBe(callsAfterReady);
		expect(result.current).toBe(stableSelection);
	});
});
