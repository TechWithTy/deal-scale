import { act, renderHook, waitFor } from "@testing-library/react";

jest.mock("@/data/__generated__/manifest", () => {
        const loaderAlpha = jest.fn(async () => ({ default: "alpha" }));
        const loaderFailure = jest.fn(async () => {
                throw new Error("boom");
        });

        return {
                __esModule: true,
                dataManifest: {
                        alpha: {
                                key: "alpha",
                                importPath: "../alpha",
                                loader: loaderAlpha,
                        },
                        failure: {
                                key: "failure",
                                importPath: "../failure",
                                loader: loaderFailure,
                        },
                },
        };
});

import { clearDataModuleStores, createDataModuleStore, useDataModule } from "../useDataModuleStore";
import { dataManifest } from "@/data/__generated__/manifest";

describe("useDataModuleStore", () => {
        beforeEach(() => {
                jest.clearAllMocks();
                clearDataModuleStores();
        });

        it("memoizes stores per key", () => {
                const first = createDataModuleStore("alpha");
                const second = createDataModuleStore("alpha");
                const other = createDataModuleStore("failure");

                expect(first).toBe(second);
                expect(other).not.toBe(first);
        });

        it("loads data exactly once when called concurrently", async () => {
                const store = createDataModuleStore("alpha");
                const loader = dataManifest.alpha.loader as jest.Mock;

                await act(async () => {
                        await Promise.all([store.getState().load(), store.getState().load()]);
                });

                expect(loader).toHaveBeenCalledTimes(1);
                expect(store.getState().status).toBe("ready");
                expect(store.getState().data).toEqual({ default: "alpha" });
        });

        it("captures loader failures", async () => {
                const store = createDataModuleStore("failure");
                const loader = dataManifest.failure.loader as jest.Mock;

                await act(async () => {
                        await expect(store.getState().load()).rejects.toThrow("boom");
                });

                expect(loader).toHaveBeenCalledTimes(1);
                expect(store.getState().status).toBe("error");
                expect(store.getState().error).toBeInstanceOf(Error);
        });

        it("reload resets error state", async () => {
                const store = createDataModuleStore("failure");
                const loader = dataManifest.failure.loader as jest.Mock;

                await act(async () => {
                        await expect(store.getState().load()).rejects.toThrow("boom");
                });

                loader.mockImplementationOnce(async () => ({ default: "recovered" }));

                await act(async () => {
                        await store.getState().reload();
                });

                expect(store.getState().status).toBe("ready");
                expect(store.getState().data).toEqual({ default: "recovered" });
        });

        it("reset returns store to idle", async () => {
                const store = createDataModuleStore("alpha");

                await act(async () => {
                        await store.getState().load();
                });

                act(() => {
                        store.getState().reset();
                });

                expect(store.getState().status).toBe("idle");
                expect(store.getState().data).toBeUndefined();
                expect(store.getState().error).toBeUndefined();
        });

        it("useDataModule hook triggers load", async () => {
                const { result } = renderHook(() => useDataModule("alpha"));

                expect(["idle", "loading"].includes(result.current.status)).toBe(true);

                await waitFor(() => {
                        expect(result.current.status).toBe("ready");
                });

                expect(result.current.data).toEqual({ default: "alpha" });
        });
});
