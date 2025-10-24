/**
 * @jest-environment node
 */

import React from "react";
import { renderToString } from "react-dom/server";

jest.mock("@/data/__generated__/manifest", () => {
	const loaderAlpha = jest.fn(async () => ({ default: "alpha" }));

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
		const selector = jest.fn(({ status, data }) => ({
			status,
			data,
		}));

		const TestComponent = () => {
			useDataModule("alpha", selector);
			return null;
		};

		renderToString(<TestComponent />);

		expect(selector).toHaveBeenCalledTimes(1);
	});
});
