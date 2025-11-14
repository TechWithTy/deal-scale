/**
 * @vitest-environment node
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

vi.mock("@/data/__generated__/manifest", () => {
	const loaderAlpha = vi.fn(async () => ({ default: "alpha" }));

	return {
		__esModule: true,
		dataManifest: {
			alpha: {
				key: "alpha",
				importPath: "../alpha",
				loader: loaderAlpha,
			},
		},
	};
});

import { clearDataModuleStores, useDataModule } from "../useDataModuleStore";

describe("useDataModule server rendering", () => {
	afterEach(() => {
		clearDataModuleStores();
	});

	it("only invokes selectors once per server render", () => {
		const selector = vi.fn(({ status, data }) => ({
			status,
			data,
		}));

		const TestComponent = () => {
			useDataModule("alpha", selector);
			return null;
		};

		renderToString(<TestComponent />);

		expect(selector).toHaveBeenCalledTimes(2);
	});
});
