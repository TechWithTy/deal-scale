import { promises as fs } from "node:fs";
import path from "node:path";

import fg from "fast-glob";

export interface GenerateDataManifestOptions {
        readonly cwd?: string;
}

interface ManifestModule {
        readonly key: string;
        readonly importPath: string;
        readonly absolutePath: string;
        readonly relativePath: string;
}

const DATA_ROOT = path.join("src", "data");
const STORES_ROOT = path.join("src", "stores");
const GENERATED_DIR = "__generated__";
const MANIFEST_FILE = "manifest.ts";
const STORE_REGISTRY_FILE = "dataStores.ts";
const DATA_MODULES_FILE = "modules.ts";

const IGNORED_PATTERNS = [
        "**/__generated__/**",
        "**/__tests__/**",
        "**/*.d.ts",
        "**/*.test.*",
        "**/*.spec.*",
];

const INDENT = "        ";

export async function generateDataManifest({ cwd = process.cwd() }: GenerateDataManifestOptions = {}) {
        const projectRoot = cwd;
        const dataDir = path.join(projectRoot, DATA_ROOT);
        const storesDir = path.join(projectRoot, STORES_ROOT);
        const generatedDataDir = path.join(dataDir, GENERATED_DIR);
        const generatedStoreDir = path.join(storesDir, GENERATED_DIR);

        await ensureDirectoryExists(dataDir, "data");
        await fs.mkdir(generatedDataDir, { recursive: true });
        await fs.mkdir(generatedStoreDir, { recursive: true });

        const moduleFiles = await fg("**/*.{ts,tsx}", {
                cwd: dataDir,
                onlyFiles: true,
                dot: false,
                followSymbolicLinks: false,
                ignore: IGNORED_PATTERNS,
        });

        const modules = moduleFiles
                .map((filePath) => toManifestModule(filePath, dataDir, generatedDataDir))
                .filter((entry): entry is ManifestModule => entry !== null);

        validateDuplicateKeys(modules);

        const sortedModules = [...modules].sort((a, b) => a.key.localeCompare(b.key));

        const manifestPath = path.join(generatedDataDir, MANIFEST_FILE);
        const storeRegistryPath = path.join(generatedStoreDir, STORE_REGISTRY_FILE);
        const dataModulesPath = path.join(generatedDataDir, DATA_MODULES_FILE);

        const manifestContent = buildManifestContent(sortedModules);
        const storeRegistryContent = buildStoreRegistryContent(sortedModules);
        const dataModulesContent = buildDataModulesContent(sortedModules);

        await fs.writeFile(manifestPath, manifestContent, "utf8");
        await fs.writeFile(storeRegistryPath, storeRegistryContent, "utf8");
        await fs.writeFile(dataModulesPath, dataModulesContent, "utf8");
}

function toManifestModule(
        filePath: string,
        dataDir: string,
        generatedDataDir: string,
): ManifestModule | null {
        const posixPath = toPosix(filePath);
        const parsed = path.posix.parse(posixPath);
        if (parsed.name.startsWith("_")) {
                return null;
        }

        const key = createModuleKey(parsed.dir, parsed.name);
        if (key === null) {
                return null;
        }

        const absolutePath = path.join(dataDir, filePath);
        const importPath = toPosix(path.relative(generatedDataDir, absolutePath)).replace(/\.(tsx|ts)$/u, "");

        return {
                key,
                importPath: importPath.startsWith(".") ? importPath : `./${importPath}`,
                absolutePath,
                relativePath: posixPath,
        };
}

function createModuleKey(directory: string, filename: string): string | null {
        if (filename.startsWith("_")) {
                return null;
        }

        if (filename === "index") {
                return directory || "index";
        }

        return directory ? `${directory}/${filename}` : filename;
}

function validateDuplicateKeys(modules: ManifestModule[]) {
        const collisions = new Map<string, ManifestModule[]>();

        for (const entry of modules) {
                const existing = collisions.get(entry.key);
                if (existing) {
                        existing.push(entry);
                } else {
                        collisions.set(entry.key, [entry]);
                }
        }

        for (const [key, entries] of collisions) {
                if (entries.length > 1) {
                        const sources = entries.map((entry) => entry.relativePath).join(", ");
                        throw new Error(`Duplicate data module key: ${key} (${sources})`);
                }
        }
}

function buildManifestContent(modules: ManifestModule[]): string {
        const lines: string[] = [];
        const keyUnion = modules.length > 0 ? modules.map((mod) => JSON.stringify(mod.key)).join(" | ") : "never";

        lines.push(`export type DataModuleKey = ${keyUnion};`);
        lines.push("");

        if (modules.length === 0) {
                lines.push("export type DataModuleLoaders = Record<never, () => Promise<never>>;");
        } else {
                lines.push("export type DataModuleLoaders = {");
                for (const mod of modules) {
                        const literalKey = JSON.stringify(mod.key);
                        const importPath = JSON.stringify(mod.importPath);
                        lines.push(
                                `${INDENT}${literalKey}: () => Promise<typeof import(${importPath})>;`,
                        );
                }
                lines.push("};");
        }

        lines.push("");
        if (modules.length === 0) {
                lines.push("export type DataModuleModules = Record<never, never>;");
        } else {
                lines.push("export type DataModuleModules = {");
                lines.push(
                        `${INDENT}[K in DataModuleKey]: Awaited<ReturnType<DataModuleLoaders[K]>>;`,
                );
                lines.push("};");
        }

        lines.push("");
        lines.push("export type DataManifestEntry<K extends DataModuleKey = DataModuleKey> = {");
        lines.push(`${INDENT}readonly key: K;`);
        lines.push(`${INDENT}readonly importPath: string;`);
        lines.push(`${INDENT}readonly loader: DataModuleLoaders[K];`);
        lines.push("};");
        lines.push("");

        if (modules.length === 0) {
                lines.push(
                        "export const dataManifest = {} as const satisfies Record<DataModuleKey, DataManifestEntry<DataModuleKey>>;",
                );
        } else {
                lines.push("export const dataManifest = {");
                for (const mod of modules) {
                        const objectKey = formatObjectKey(mod.key);
                        const literalKey = JSON.stringify(mod.key);
                        const importPath = JSON.stringify(mod.importPath);
                        lines.push(
                                `${INDENT}${objectKey}: { key: ${literalKey}, importPath: ${importPath}, loader: () => import(${importPath}) },`,
                        );
                }
                lines.push("} as const satisfies Record<DataModuleKey, DataManifestEntry<DataModuleKey>>;");
        }

        lines.push("");
        lines.push("export type DataManifest = typeof dataManifest;");
        lines.push("");
        lines.push('export type DataModuleLoader<K extends DataModuleKey = DataModuleKey> = DataModuleLoaders[K];');
        lines.push("");
        lines.push('export type DataModuleModule<K extends DataModuleKey = DataModuleKey> = DataModuleModules[K];');
        lines.push("");

        return `${lines.join("\n")}\n`;
}

function buildStoreRegistryContent(modules: ManifestModule[]): string {
        const lines: string[] = [];
        lines.push('import type { DataModuleKey } from "@/data/__generated__/manifest";');
        lines.push('import { createDataModuleStore } from "@/stores/useDataModuleStore";');
        lines.push("");

        if (modules.length === 0) {
                lines.push(
                        "export const dataStores = {} as const satisfies Record<DataModuleKey, ReturnType<typeof createDataModuleStore>>;",
                );
        } else {
                lines.push("export const dataStores = {");
                for (const mod of modules) {
                        const objectKey = formatObjectKey(mod.key);
                        const literalKey = JSON.stringify(mod.key);
                        lines.push(`${INDENT}${objectKey}: createDataModuleStore(${literalKey}),`);
                }
                lines.push(
                        "} as const satisfies Record<DataModuleKey, ReturnType<typeof createDataModuleStore>>;",
                );
        }

        lines.push("");
        lines.push("export const dataStoreKeys = Object.keys(dataStores) as DataModuleKey[];");
        lines.push("");

        return `${lines.join("\n")}\n`;
}

function buildDataModulesContent(modules: ManifestModule[]): string {
        const lines: string[] = [];
        lines.push('import type { DataModuleKey, DataModuleModule } from "@/data/__generated__/manifest";');

        if (modules.length === 0) {
                lines.push("");
                lines.push(
                        "export const dataModules = {} as const satisfies Record<DataModuleKey, never>;",
                );
        } else {
                const usedIdentifiers = new Set<string>();
                const moduleIdentifiers = modules.map((mod) => ({
                        module: mod,
                        identifier: createImportIdentifier(mod.key, usedIdentifiers),
                }));

                for (const { module, identifier } of moduleIdentifiers) {
                        lines.push(`import * as ${identifier} from "${module.importPath}";`);
                }

                lines.push("");
                lines.push("export const dataModules = {");
                for (const { module, identifier } of moduleIdentifiers) {
                        const objectKey = formatObjectKey(module.key);
                        lines.push(`${INDENT}${objectKey}: ${identifier},`);
                }
                lines.push("} as const satisfies { [K in DataModuleKey]: DataModuleModule<K> };");
        }

        lines.push("");
        lines.push("export type DataModules = typeof dataModules;");
        lines.push("");
        lines.push("export const dataModuleKeys = Object.keys(dataModules) as DataModuleKey[];");
        lines.push("");
        lines.push("export function getDataModule<K extends DataModuleKey>(key: K): DataModuleModule<K> {");
        lines.push(`${INDENT}return dataModules[key];`);
        lines.push("}");
        lines.push("");

        return `${lines.join("\n")}\n`;
}

function toPosix(value: string): string {
        return value.split(path.sep).join(path.posix.sep);
}

function formatObjectKey(key: string): string {
        return /^[A-Za-z_][A-Za-z0-9_]*$/u.test(key) ? key : JSON.stringify(key);
}

function createImportIdentifier(key: string, used: Set<string>): string {
        const segments = key
                .split(/[\/]/u)
                .flatMap((segment) => segment.split(/[-_]+/u))
                .map((segment) => segment.replace(/[^A-Za-z0-9]/gu, ""))
                .filter(Boolean)
                .map((segment, index) => {
                        if (segment.length === 0) {
                                return "";
                        }
                        const lower = segment.toLowerCase();
                        if (index === 0) {
                                return lower;
                        }
                        return lower.charAt(0).toUpperCase() + lower.slice(1);
                });

        let base = segments.join("");
        if (base.length === 0) {
                base = "module";
        }

        if (!/^[A-Za-z_]/u.test(base)) {
                base = `mod${base}`;
        }

        let candidate = `${base}Module`;
        let suffix = 1;
        while (used.has(candidate)) {
                candidate = `${base}Module${suffix}`;
                suffix += 1;
        }
        used.add(candidate);

        return candidate;
}

async function ensureDirectoryExists(directoryPath: string, label: string) {
        try {
                const stats = await fs.stat(directoryPath);
                if (!stats.isDirectory()) {
                        throw new Error(`Expected ${label} directory at ${directoryPath}`);
                }
        } catch (error: unknown) {
                if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                        throw new Error(`Missing ${label} directory at ${directoryPath}`);
                }
                throw error;
        }
}

if (require.main === module) {
        generateDataManifest().catch((error) => {
                console.error(error);
                process.exitCode = 1;
        });
}
