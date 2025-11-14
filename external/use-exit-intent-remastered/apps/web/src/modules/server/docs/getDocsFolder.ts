import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);

type PackageJson = {
	docsFolder?: string;
};

const packageJSON = require("../../../../package.json") as PackageJson;

export function getDocsFolder() {
	return resolve(packageJSON.docsFolder ?? "docs");
}
