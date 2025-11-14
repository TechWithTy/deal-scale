import { defineConfig, RsbuildConfig } from '@rsbuild/core';
// Merge the existing rsbuild config with safe overrides:
// - Use resolve.alias instead of deprecated source.alias
// - Ensure dist path is a subdir of this root and is cleaned
// - Gate Rsdoctor plugin by RS_DOCTOR while preserving any existing rspack tool hook

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - rsbuild CLI transpiles TS config
import baseConfig from './rsbuild.config';

const base = (baseConfig || {}) as RsbuildConfig;

export default defineConfig({
  // spread base first to retain settings
  ...(base as any),
  resolve: {
    ...(base as any).resolve,
    alias:
      ((base as any).resolve && (base as any).resolve.alias) ||
      ((base as any).source && (base as any).source.alias) ||
      {},
  },
  output: {
    ...(base as any).output,
    distPath: {
      ...((base as any).output?.distPath || {}),
      root: 'dist', // tools/rspack-preview/dist
    },
    cleanDistPath: true,
  },
  tools: {
    ...(base as any).tools,
    rspack: (config: any) => {
      // Call original hook if provided
      const orig = (base as any).tools?.rspack as ((cfg: any) => void) | undefined;
      if (typeof orig === 'function') {
        orig(config);
      }
      if (process.env.RS_DOCTOR) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin');
        config.plugins = [...(config.plugins || []), new RsdoctorRspackPlugin({ enableReport: true })];
      }
    },
  },
});

