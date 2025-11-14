/** @jest-environment node */

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import { generateDataManifest } from "../../../tools/data/generate-data-manifest";

async function createFixtureFile(
	root: string,
	relativePath: string,
	content = "export const value = true;\n",
) {
	const filePath = path.join(root, relativePath);
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, content, "utf8");
}

describe("generateDataManifest", () => {
	let tempDir: string;
	const originalCwd = process.cwd();

	beforeEach(async () => {
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "manifest-test-"));
		await fs.mkdir(path.join(tempDir, "src", "data"), { recursive: true });
		await fs.mkdir(path.join(tempDir, "src", "stores"), { recursive: true });
		process.chdir(tempDir);
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		await fs.rm(tempDir, { recursive: true, force: true });
	});

	it("creates a manifest for all non-underscored modules", async () => {
		await createFixtureFile(tempDir, "src/data/alpha.ts");
		await createFixtureFile(tempDir, "src/data/nested/beta.ts");
		await createFixtureFile(tempDir, "src/data/nested/index.tsx");
		await createFixtureFile(tempDir, "src/data/_internal.ts");

		await generateDataManifest({ cwd: tempDir });

		const manifestPath = path.join(
			tempDir,
			"src/data/__generated__/manifest.ts",
		);
		const modulesPath = path.join(tempDir, "src/data/__generated__/modules.ts");
		const storePath = path.join(
			tempDir,
			"src/stores/__generated__/dataStores.ts",
		);

		const manifestContent = await fs.readFile(manifestPath, "utf8");
		const modulesContent = await fs.readFile(modulesPath, "utf8");
		const storeContent = await fs.readFile(storePath, "utf8");
		const manifestSnapshot = manifestContent.trim();
		const modulesSnapshot = modulesContent.trim();
		const storeSnapshot = storeContent.trim();
		const expectedManifest = [
			'export type DataModuleKey = "alpha" | "nested" | "nested/beta";',
			"",
			"export type DataModuleLoaders = {",
			'        "alpha": () => Promise<typeof import("../alpha")>;',
			'        "nested": () => Promise<typeof import("../nested/index")>;',
			'        "nested/beta": () => Promise<typeof import("../nested/beta")>;',
			"};",
			"",
			"export type DataModuleModules = {",
			"        [K in DataModuleKey]: Awaited<ReturnType<DataModuleLoaders[K]>>;",
			"};",
			"",
			"export type DataManifestEntry<K extends DataModuleKey = DataModuleKey> = {",
			"        readonly key: K;",
			"        readonly importPath: string;",
			"        readonly loader: DataModuleLoaders[K];",
			"};",
			"",
			"export const dataManifest = {",
			'        alpha: { key: "alpha", importPath: "../alpha", loader: () => import("../alpha") },',
			'        nested: { key: "nested", importPath: "../nested/index", loader: () => import("../nested/index") },',
			'        "nested/beta": { key: "nested/beta", importPath: "../nested/beta", loader: () => import("../nested/beta") },',
			"} as const satisfies { readonly [K in DataModuleKey]: DataManifestEntry<K> };",
			"",
			"export type DataManifest = typeof dataManifest;",
			"",
			"export type DataModuleLoader<K extends DataModuleKey = DataModuleKey> = DataModuleLoaders[K];",
			"",
			"export type DataModuleModule<K extends DataModuleKey = DataModuleKey> = DataModuleModules[K];",
		].join("\n");

		const expectedModules = [
			'import type { DataModuleKey, DataModuleModule } from "@/data/__generated__/manifest";',
			'import * as alphaModule from "../alpha";',
			'import * as nestedModule from "../nested/index";',
			'import * as nestedBetaModule from "../nested/beta";',
			"",
			"export const dataModules = {",
			"        alpha: alphaModule,",
			"        nested: nestedModule,",
			'        "nested/beta": nestedBetaModule,',
			"} as const satisfies { [K in DataModuleKey]: DataModuleModule<K> };",
			"",
			"export type DataModules = typeof dataModules;",
			"",
			"export const dataModuleKeys = Object.keys(dataModules) as DataModuleKey[];",
			"",
			"export function getDataModule<K extends DataModuleKey>(key: K): DataModuleModule<K> {",
			"        return dataModules[key];",
			"}",
		].join("\n");

		const expectedStore = [
			'import type { DataModuleKey } from "@/data/__generated__/manifest";',
			'import { createDataModuleStore } from "@/stores/useDataModuleStore";',
			"",
			"export const dataStores = {",
			'        alpha: createDataModuleStore("alpha"),',
			'        nested: createDataModuleStore("nested"),',
			'        "nested/beta": createDataModuleStore("nested/beta"),',
			"} as const satisfies Record<DataModuleKey, ReturnType<typeof createDataModuleStore>>;",
			"",
			"export const dataStoreKeys = Object.keys(dataStores) as DataModuleKey[];",
		].join("\n");

		expect(manifestSnapshot).toBe(expectedManifest);
		expect(modulesSnapshot).toBe(expectedModules);
		expect(storeSnapshot).toBe(expectedStore);
	});

	it("throws on duplicate module keys", async () => {
		await createFixtureFile(tempDir, "src/data/example.ts");
		await createFixtureFile(tempDir, "src/data/example/index.ts");

		await expect(generateDataManifest({ cwd: tempDir })).rejects.toThrow(
			/Duplicate data module key: example/,
		);
	});

	it("orders manifest keys deterministically", async () => {
		await Promise.all(
			["zeta.ts", "gamma.ts", "beta/index.ts", "beta/a.tsx"].map((file) =>
				createFixtureFile(
					tempDir,
					path.join("src/data", file),
					"export const value = true;\n",
				),
			),
		);

		await generateDataManifest({ cwd: tempDir });

		const manifestPath = path.join(
			tempDir,
			"src/data/__generated__/manifest.ts",
		);
		const manifestContent = await fs.readFile(manifestPath, "utf8");

		const keyLine = manifestContent
			.split("\n")
			.find((line) => line.startsWith("export type DataModuleKey"));

		expect(keyLine).toBe(
			'export type DataModuleKey = "beta" | "beta/a" | "gamma" | "zeta";',
		);
	});
});
