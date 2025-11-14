// Example: modularize imports and long-cache headers without altering your current config
// Merge these into your existing next.config.js carefully.

/** @type {import('next').NextConfig} */
const config = {
  modularizeImports: {
    lodash: { transform: 'lodash/{{member}}' },
    'date-fns': { transform: 'date-fns/{{member}}' },
    'react-icons/?(((\\w*)?/?)*)': { transform: 'react-icons/{{ matches.[1] }}/{{member}}' },
  },
  experimental: {
    optimizePackageImports: ['lodash', 'date-fns', 'react-use', 'react-icons', 'lucide-react'],
  },
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: '/:all*(js|css|png|jpg|jpeg|webp|svg|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = config

