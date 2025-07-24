# Strapi CMS: Implementation & Integration Plan

- **Author**: Ty the Programmer
- **Status**: In Progress
- **Date**: 2025-07-15

---

## 1. Executive Summary

This document outlines a phased plan to implement a self-hosted Strapi CMS and integrate it with the existing Next.js frontend. The primary goals are to establish a robust, scalable, and type-safe content management system that empowers the marketing team while adhering to development best practices.

## 2. Core Technologies

- **Frontend**: Next.js 15+, React 18+, TypeScript, TanStack Query v5, Zod, Shadcn/UI, `react-markdown`
- **CMS**: Strapi v4 (Self-Hosted)
- **Database**: PostgreSQL
- **Deployment**: Docker, Docker Compose, DigitalOcean, Traefik
- **Media Storage**: Cloudinary
- **CI/CD**: GitHub Actions

---

## 3. Implementation Phases

### Phase 1: Local Development Setup (Docker)

*Goal: Create a reproducible local environment for Strapi development.* 

1.  **Docker Compose Setup**:
    -   Create a `docker-compose.yml` file in the Strapi project root.
    -   Define three services:
        -   `strapi`: The main Strapi application, using the official Docker image.
        -   `postgres`: PostgreSQL database, using the official image.
        -   `adminer`: A lightweight database management tool.
    -   Use Docker volumes for persistent PostgreSQL data.
    -   Use environment variables (`.env` file) for all secrets (DB credentials, API tokens).

### Phase 2: Content Modeling & Schema-First Workflow

*Goal: Define the content structure programmatically from a single source of truth.* 

1.  **Schema-First Strategy**:
    -   Establish a `schema-first` workflow where TypeScript/Zod schemas are the source of truth.
    -   Create a script (`scripts/generate-schemas.ts`) in the Strapi project.
    -   This script will read Zod schemas and automatically generate the required `schema.json` files for Strapi content types.
2.  **Define Initial Content Types**:
    -   `Case Study`: For portfolio items.
    -   `Service`: For company offerings.
    -   `Team Member`: For the 'About Us' section.
    -   `Testimonial`: For social proof.
3.  **Run Schema Generator**: Execute the script to create the content types in Strapi.
4.  **Configure Roles & Permissions**:
    -   In the Strapi Admin UI, create a dedicated `frontend` role.
    -   Grant read-only (`find`, `findOne`) permissions to this role for all public-facing content types.

### Phase 3: Data Seeding

*Goal: Populate the local CMS with realistic mock data for development.* 

1.  **Create Seeding Script**:
    -   Create a script (`scripts/seed.ts`) in the Strapi project.
    -   The script will:
        -   Read from local mock data files.
        -   Use a `mapper` function to transform mock data into the structure required by Strapi.
        -   Validate the transformed data against the Zod schemas.
        -   Use the Strapi REST API to create entries.
2.  **Add `db:seed` Command**: Add a script to `package.json` to easily run the seeder.

### Phase 4: Frontend Integration (Local)

*Goal: Connect the Next.js app to the local Strapi instance and fetch data.* 

1.  **Environment Setup**: Add `STRAPI_API_URL` and `STRAPI_API_TOKEN` to the Next.js project's `.env.local` file.
2.  **Data Fetching Layer**:
    -   Create a dedicated service file (e.g., `services/strapi.ts`) for all API interactions.
    -   Use TanStack Query for data fetching, caching, and state management.
    -   Implement fetching functions for each content type (e.g., `getCaseStudies`, `getServices`).
3.  **Dynamic CTA Logic**:
    -   In `ServiceCard.tsx`, implement logic to render different CTA buttons and links (`/contact`, `/contact-pilot`) based on a field from the Strapi `Service` data.
4.  **Render Rich Text**: Use `react-markdown` to safely render Markdown content from Strapi fields (e.g., service descriptions, case study bodies).

### Phase 5: Production Deployment

*Goal: Deploy a scalable and secure Strapi instance to production.* 

1.  **Infrastructure Setup (DigitalOcean)**:
    -   Provision a Droplet for hosting the Strapi application.
    -   Set up a managed PostgreSQL database.
    -   Configure a Cloudinary account for media storage.
2.  **Production Docker Compose**:
    -   Create a `docker-compose.prod.yml`.
    -   Configure the Strapi service to connect to the managed database and Cloudinary.
    -   Set up Traefik for reverse proxy, SSL certificate management (Let's Encrypt), and routing.
3.  **CI/CD with GitHub Actions**:
    -   Create a workflow (`.github/workflows/deploy-strapi.yml`).
    -   On push to `main`, the workflow will:
        -   Build a new Strapi Docker image.
        -   Push the image to a container registry (e.g., Docker Hub, GitHub Container Registry).
        -   SSH into the DigitalOcean Droplet and run `docker-compose pull && docker-compose up -d` to deploy the new version.
    -   Use GitHub Secrets to securely manage all production environment variables.

### Phase 6: Full Integration & Go-Live

*Goal: Switch the Next.js app to the live Strapi instance and enable ISR.* 

1.  **Update Frontend Environment**: Point the Next.js production environment variables to the live Strapi URL.
2.  **Implement Incremental Static Regeneration (ISR)**:
    -   Use `revalidate` in `getStaticProps` or the `fetch` options to keep content fresh without requiring a full rebuild for every content change.
3.  **End-to-End Testing**: Thoroughly test all content-driven pages and functionality.
