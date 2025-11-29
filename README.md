# DealScale - AI-Powered Business Solutions

[![Proprietary](https://img.shields.io/badge/License-Proprietary-FF6B6B)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13+-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Overview

DealScale is a cutting-edge platform that leverages AI to transform business operations, providing intelligent solutions for deal management, customer engagement, and data-driven decision making.

## ✨ Features

- **AI-Powered Analytics**: Get actionable insights from your business data
- **Seamless Integration**: Works with your existing tools and workflows
- **Real-time Collaboration**: Team-focused features for better productivity
- **Customizable Dashboards**: Tailor your view to see what matters most
- **Secure & Scalable**: Enterprise-grade security and performance

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 6.0.0 or later
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/deal-scale.git
   cd deal-scale
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your configuration. The analytics loaders now expect the secure env vars first and fall back to the legacy `NEXT_PUBLIC_*` names only during development:
   ```env
   CLARITY_PROJECT_ID=your_clarity_project_id
   GOOGLE_ANALYTICS_ID=your_ga_measurement_id
   GOOGLE_TAG_MANAGER_ID=your_gtm_container_id
   ZOHO_SALES_IQ_WIDGET_CODE=your_zoho_salesiq_widget_code

   # Optional dev fallbacks
   NEXT_PUBLIC_CLARITY_PROJECT_ID=your_dev_clarity_id
   NEXT_PUBLIC_GOOGLE_ANALYTICS=your_dev_ga_id
   NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=your_dev_gtm_id
   NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE=your_dev_zoho_code
   ```
   The `_docs/_debug/deferred_third_parties_debug.md` guide contains a full checklist plus troubleshooting notes.

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   The `tools/checks/check-analytics-env.ts` helper runs automatically and will highlight any missing analytics configuration before Next.js boots. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

Deploy your own instance of DealScale with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fdeal-scale&project-name=deal-scale&repository-name=deal-scale)

## 🔁 CI/CD & Containers

- Automated backend/front-end checks run via [`.github/workflows/ci.yml`](.github/workflows/ci.yml) on every push and pull request. The workflow installs dependencies with pnpm, runs linting, unit tests, a production build, and finally performs a smoke test against the Docker Compose stack.
- A multi-stage [`Dockerfile`](Dockerfile) is available for building the production image. The new `docker-compose.ci.yml` spins up the app alongside Postgres and Redis with sensible defaults for CI or local smoke testing:

  ```bash
  docker compose -f docker-compose.ci.yml up --build
  # open http://localhost:3000 once the services report healthy
  ```

  Use `docker compose down -v` to tear everything back down when finished.

- The dedicated landing-page pipeline in [`.github/workflows/landing.yml`](.github/workflows/landing.yml) exports static assets (`pnpm run landing:build`), validates required metadata/alt text, runs a Lighthouse SEO audit (`@lhci/cli`), pings the contact endpoint, and deploys the `dist/` bundle to Cloudflare Pages. Configure the following secrets before enabling deployments:

  | Secret | Purpose |
  | --- | --- |
  | `CF_API_TOKEN` | Cloudflare Pages API token with `Pages=Edit` |
  | `CF_ACCOUNT_ID` | Cloudflare account identifier |
  | `CF_PAGES_PROJECT` | Target Pages project slug |
  | `CONTACT_TEST_URL` *(optional)* | Override contact endpoint for smoke test |
  | `SLACK_WEBHOOK` | Channel notifications for success/failure |

## 📖 Documentation

For detailed documentation, please visit our [Documentation Portal](https://docs.dealscale.com). Internal debug notes for the analytics loaders live in [`_docs/_debug/deferred_third_parties_debug.md`](./_docs/_debug/deferred_third_parties_debug.md).

Key internal docs:

- [`docs/commit-workflow.md`](docs/commit-workflow.md) — Husky hook behavior, staging shortcut, security scan flow.
- [`docs/commitlint-conventions.md`](docs/commitlint-conventions.md) — required commit message structure and allowed types/scopes.
- [`docs/opengrep.md`](docs/opengrep.md) — static analysis setup using Opengrep with SARIF archiving.

## 📄 License

This is proprietary software. All rights reserved. Unauthorized copying, modification, distribution, display, or use of this software, via any medium is strictly prohibited. For licensing inquiries, please contact us at [sam.scaler@dealscale.io](mailto:sam.scaler@dealscale.io).

### Content Feeds

- [`https://dealscale.io/rss.xml`](https://dealscale.io/rss.xml) — proxied Beehiiv newsletter feed.
- [`https://dealscale.io/rss/youtube.xml`](https://dealscale.io/rss/youtube.xml) — proxied YouTube channel feed.
- [`https://dealscale.io/rss/hybrid.xml`](https://dealscale.io/rss/hybrid.xml) — combined blog + video feed.
- [`https://dealscale.io/videos/sitemap.xml`](https://dealscale.io/videos/sitemap.xml) — generated video sitemap. Run `pnpm run sitemap:videos` to refresh.
- See [`docs/rss-feeds.md`](docs/rss-feeds.md) for implementation details and maintenance notes.

## 📞 Contact

For business inquiries or support, please [contact our team](mailto:support@dealscale.io).

## 💼 Commercial Use

This software is available for commercial licensing. For pricing and licensing information, please contact our sales team at [sam.scaler@dealscale.io](mailto:sam.scaler@dealscale.io).

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
