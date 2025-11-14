import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

type CmdResult = {
  cmd: string;
  code: number | null;
  stdout: string;
  stderr: string;
};

function run(cmd: string, args: string[], cwd?: string): CmdResult {
  const res = spawnSync(cmd, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    cwd,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    cmd: [cmd, ...args].join(" "),
    code: res.status,
    stdout: res.stdout || "",
    stderr: res.stderr || "",
  };
}

function nowStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function write(outDir: string, name: string, content: string) {
  writeFileSync(join(outDir, name), content, { encoding: "utf8" });
}

function copyIfExists(outDir: string, srcRel: string, destName?: string) {
  try {
    if (existsSync(srcRel)) {
      const target = join(outDir, destName ?? srcRel.replace(/[\\/]/g, "__"));
      copyFileSync(srcRel, target);
    }
  } catch {}
}

function main() {
  const stamp = nowStamp();
  const outDir = join(process.cwd(), "reports", "doctor", stamp);
  mkdirSync(outDir, { recursive: true });

  // Basic environment snapshot
  const envInfo = [
    `platform=${process.platform}`,
    `arch=${process.arch}`,
    `node=${process.version}`,
    `cwd=${process.cwd()}`,
    `pnpm=${run("pnpm", ["-v"]).stdout.trim()}`,
    `npm=${run("npm", ["-v"]).stdout.trim()}`,
    `next=${run("pnpm", ["exec", "next", "--version"]).stdout.trim()}`,
    `tsc=${run("pnpm", ["exec", "tsc", "-v"]).stdout.trim()}`,
  ].join("\n");
  write(outDir, "env.txt", envInfo + "\n");

  // Save key config files for context
  [
    "package.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "next.config.ts",
    "next-env.d.ts",
    "vercel.json",
    "wrangler.toml",
    "pnpm-lock.yaml",
    "tailwind.config.ts",
  ].forEach((p) => copyIfExists(outDir, p));

  // Git snapshot
  const gitSha = run("git", ["rev-parse", "--short", "HEAD"]);
  const gitStatus = run("git", ["status", "--porcelain=v1"]);
  write(outDir, "git.txt", [gitSha.stdout || gitSha.stderr, "\n---\n", gitStatus.stdout || gitStatus.stderr].join(""));

  // Next doctor (verbose)
  const doctor = run("pnpm", ["exec", "next", "doctor", "--verbose"]);
  write(outDir, "next-doctor.log", [doctor.cmd, "\n\n", doctor.stdout, "\n\n[stderr]\n", doctor.stderr].join(""));

  // TypeScript check
  const typecheck = run("pnpm", ["run", "typecheck"]);
  write(outDir, "typecheck.log", [typecheck.cmd, "\n\n", typecheck.stdout, "\n\n[stderr]\n", typecheck.stderr].join(""));

  // Next lint (if configured)
  const lint = run("pnpm", ["exec", "next", "lint" ]);
  write(outDir, "next-lint.log", [lint.cmd, "\n\n", lint.stdout, "\n\n[stderr]\n", lint.stderr].join(""));

  // Optional: dependency tree for next/typescript
  const whyTs = run("pnpm", ["why", "typescript"]);
  write(outDir, "why-typescript.log", [whyTs.cmd, "\n\n", whyTs.stdout, "\n\n[stderr]\n", whyTs.stderr].join(""));

  const whyNext = run("pnpm", ["why", "next"]);
  write(outDir, "why-next.log", [whyNext.cmd, "\n\n", whyNext.stdout, "\n\n[stderr]\n", whyNext.stderr].join(""));

  // Summary
  write(outDir, "SUMMARY.txt", [
    "Collected doctor diagnostics",
    `Folder: ${outDir}`,
    "Files:",
    "- env.txt",
    "- git.txt",
    "- next-doctor.log",
    "- typecheck.log",
    "- next-lint.log",
    "- why-typescript.log",
    "- why-next.log",
    "- package.json, tsconfig*, next.config.ts (if present)",
  ].join("\n") + "\n");

  // Print path to stdout for convenience
  // eslint-disable-next-line no-console
  console.log(outDir);
}

try {
  main();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("Failed to collect doctor logs:", err);
  process.exit(1);
}

