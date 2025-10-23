import { renderHook, waitFor, act } from "@testing-library/react";

import { clearDataModuleStores, useDataModule } from "../useDataModuleStore";

describe("useDataModule", () => {
        afterEach(() => {
                clearDataModuleStores();
        });

        it("stabilizes selector outputs to prevent redundant re-renders", async () => {
                const renderSpy = jest.fn();

                const { result } = renderHook(() => {
                        renderSpy();
                        return useDataModule(
                                "service/services",
                                ({ status, data }) => ({
                                        status,
                                        services: data?.services ?? {},
                                }),
                        );
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
});
