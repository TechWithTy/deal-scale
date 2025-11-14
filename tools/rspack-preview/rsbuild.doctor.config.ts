import { defineConfig } from '@rsbuild/core';

// RSDoctor-focused rsbuild config used by doctor runner.
// - Uses resolve.alias (not deprecated source.alias)
// - Ensures dist is a subfolder of this config root and cleans it
// - Injects RsdoctorRspackPlugin so .rsdoctor/manifest.json is generated

export default defineConfig({
  resolve: {
    alias: {
      // Add project aliases here if needed, e.g.:
      // '@app': new URL('../../src', import.meta.url).pathname,
    },
  },
  output: {
    distPath: {
      // Generate dist within the preview tool root to avoid warnings
      root: 'dist',
    },
    cleanDistPath: true,
  },
  tools: {
    rspack: (config) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin');
        config.plugins = [...(config.plugins || []), new RsdoctorRspackPlugin({ enableReport: true })];
      } catch (e) {
        // Plugin not installed; doctor runner will fail gracefully later
      }
    },
  },
});

