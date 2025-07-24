# Strapi Docker Deployment Debug Log

## Table of Contents
- [Issue Summary](#issue-summary)
- [Environment](#environment)
- [Detailed Error Analysis](#detailed-error-analysis)
- [Attempted Solutions](#attempted-solutions)
  - [1. Official Strapi Docker Image](#1-official-strapi-docker-image)
  - [2. Custom Dockerfile with pnpm](#2-custom-dockerfile-with-pnpm)
  - [3. .pnpmfile.cjs Workaround](#3-pnpmfilecjs-workaround)
  - [4. .npmrc Configuration](#4-npmrc-configuration)
  - [5. pnpm --ignore-scripts Flag](#5-pnpm---ignore-scripts-flag)
- [Current Status](#current-status)
- [Next Steps to Try](#next-steps-to-try)
- [Detailed Technical Analysis](#detailed-technical-analysis)
- [Key Learnings](#key-learnings)
- [Related Files](#related-files)
- [References](#references)

## Issue Summary
Persistent failure to build Strapi v4 in Docker due to build scripts not executing during `pnpm install`, resulting in missing compiled files (`dist/cli`). The core issue manifests when Strapi attempts to start but cannot find required compiled JavaScript files that should be generated during the build process.

## Environment
### Software Versions
- **Strapi**: v4.18.0
- **Node.js**: 18.20.8 (Alpine)
- **pnpm**: 10.13.1
- **Docker**: Docker Desktop for Windows 4.30.0
- **Docker Compose**: v2.25.0
- **Operating System**: Windows 11 Pro 23H2

### Project Structure
```
deal-scale/
├── apps/
│   └── strapi/             # Strapi application
│       ├── config/         # Strapi configuration
│       ├── src/            # Application source
│       ├── .dockerignore   # Docker ignore rules
│       └── Dockerfile      # Custom Docker configuration
└── docker/
    ├── docker-compose.yml  # Service definitions
    └── .pnpmfile.cjs       # pnpm hooks configuration
```

## Detailed Error Analysis
The primary error encountered is:
```
Error: Cannot find module './dist/cli'
Require stack:
- /opt/app/node_modules/.pnpm/@strapi+admin@4.18.0_*/node_modules/@strapi/admin/index.js
```

**Root Cause Analysis**:
1. Strapi requires certain packages to execute build scripts during installation
2. pnpm's security model blocks these scripts by default in Docker
3. The build process fails because required files in `dist/` directories are not generated
4. The error cascades because Strapi cannot find the compiled CLI utilities it needs to start

## Attempted Solutions

### 1. Official Strapi Docker Image
**Approach**: 
- Attempted to use official Strapi Docker images (`strapi/strapi:4` and `strapi/strapi:4.18.0`)
- Based on outdated documentation suggesting official images exist

**Configuration**:
```yaml
services:
  strapi:
    image: strapi/strapi:4.18.0  # This image doesn't exist
    # ... rest of the configuration
```

**Result**: Failed - No official Strapi v4 images exist
**Error**: 
```
Error response from daemon: manifest for strapi/strapi:4.18.0 not found
```
**Analysis**: Official Docker images are only available for Strapi v3, not v4.

### 2. Custom Dockerfile with pnpm
**Approach**: 
- Created a custom Dockerfile using Node 18 Alpine
- Used pnpm as the package manager
- Multi-stage build to optimize image size

**Dockerfile Snippet**:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 1337
CMD ["pnpm", "develop"]
```

**Result**: Failed - Build scripts not executing
**Error**: 
```
Error: Cannot find module './dist/cli'
```
**Analysis**: pnpm's security model prevents build scripts from running by default in Docker.

### 3. .pnpmfile.cjs Workaround
**Approach**: 
- Created `.pnpmfile.cjs` to explicitly allow build scripts
- Attempted to modify package scripts during installation

**Configuration**:
```javascript
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.scripts) {
        pkg.scripts = Object.entries(pkg.scripts).reduce((acc, [key, value]) => {
          if (['preinstall', 'install', 'postinstall', 'prepare'].includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {});
      }
      return pkg;
    }
  }
};
```

**Result**: Failed - Lockfile checksum mismatch
**Error**: 
```
Checksum mismatch
```
**Analysis**: The pnpm lockfile validation failed because the package scripts were modified after the lockfile was generated.

### 4. .npmrc Configuration
**Approach**: 
- Created `.npmrc` to whitelist specific packages for build script execution
- Used `only-built-dependencies` to explicitly allow build scripts

**Configuration**:
```ini
# .npmrc
only-built-dependencies[]=@strapi/strapi
only-built-dependencies[]=@swc/core
only-built-dependencies[]=better-sqlite3
only-built-dependencies[]=esbuild
only-built-dependencies[]=sharp
only-built-dependencies[]=core-js-pure
```

**Result**: Failed - Build scripts still ignored
**Error**: 
```
Error: Cannot find module './dist/cli'
```
**Analysis**: The `.npmrc` configuration was either not being read or not having the intended effect in the Docker build context.

### 5. pnpm --ignore-scripts Flag
**Approach**: 
- Added `--ignore-scripts=false` flag to force script execution
- Attempted to override pnpm's default security settings

**Dockerfile Modification**:
```dockerfile
RUN pnpm install --ignore-scripts=false
```

**Result**: Failed - Build scripts still not executing
**Error**: 
```
Error: Cannot find module './dist/cli'
```
**Analysis**: The flag was either ignored or not sufficient to override pnpm's security model in the Docker environment.

## Current Status
As of 2025-07-15, the issue remains unresolved. The core problem is that pnpm is not executing the necessary build scripts during installation, despite various configuration attempts. The build process fails because Strapi cannot find required compiled files that should be generated during the installation.

## Next Steps to Try

### High Priority
1. **Switch to npm or yarn**
   - Create a new branch
   - Replace pnpm with npm or yarn
   - Update Dockerfile to use the new package manager
   - Test the build process

2. **Alternative Docker Base Image**
   - Try using `node:18-bullseye-slim` instead of Alpine
   - Ensure all required system dependencies are installed
   ```dockerfile
   FROM node:18-bullseye-slim
   RUN apt-get update && apt-get install -y \
       build-essential \
       python3 \
       make \
       g++
   ```

### Medium Priority
3. **Multi-stage Build with Pre-built Dependencies**
   - Build the application outside Docker
   - Copy the built files into the container
   - Example:
     ```dockerfile
     FROM node:18-alpine AS builder
     WORKDIR /app
     COPY . .
     RUN npm install && npm run build

     FROM node:18-alpine
     WORKDIR /app
     COPY --from=builder /app/node_modules ./node_modules
     COPY --from=builder /app/.tmp ./.tmp
     COPY --from=builder /app/dist ./dist
     CMD ["npm", "start"]
     ```

4. **Check Strapi Community Solutions**
   - Search for community-maintained Docker images
   - Review Strapi GitHub issues for similar problems
   - Consider using a different Strapi version

### Low Priority
5. **Debugging Tools**
   - Add debugging output to Docker build
   - Check file permissions in the container
   - Examine the container filesystem after failed build
   ```dockerfile
   RUN find /app/node_modules -name "dist" -type d | xargs ls -la
   ```

## Detailed Technical Analysis

### Build Script Dependencies
Strapi and its dependencies require the following build scripts to run:
- `@strapi/strapi`: Builds admin panel and compiles backend
- `better-sqlite3`: Compiles native bindings
- `sharp`: Compiles image processing libraries
- `esbuild`: Bundles frontend assets

### pnpm Behavior in Docker
- pnpm uses a content-addressable store
- Build scripts are disabled by default in CI/Docker environments
- The `--ignore-scripts` flag is automatically set in some environments

### Potential Solutions Not Yet Tried
1. **Environment Variable Override**
   ```dockerfile
   ENV NPM_CONFIG_IGNORE_SCRIPTS=false
   ENV PNPM_IGNORE_SCRIPTS=false
   ```

2. **Direct Script Execution**
   ```dockerfile
   RUN pnpm install
   RUN cd node_modules/@strapi/strapi && pnpm run build
   ```

3. **Volume Mounting for Development**
   ```yaml
   services:
     strapi:
       volumes:
         - ./apps/strapi:/srv/app
         - /srv/app/node_modules  # Keep node_modules in container
   ```

## Key Learnings

### Package Management
- pnpm's strict security model makes it challenging to run build scripts in Docker
- The `--ignore-scripts` behavior is more restrictive in containerized environments
- Lockfile validation can fail when modifying package scripts

### Docker-Specific Challenges
- Build context and layer caching can affect dependency installation
- File permissions and ownership must be carefully managed
- Multi-stage builds can help separate build and runtime environments

### Strapi-Specific Insights
- Strapi relies heavily on build-time compilation
- The admin panel requires specific build steps
- Native dependencies (like `better-sqlite3`) need compilation during installation

### Best Practices Discovered
1. **Reproducible Builds**
   - Pin exact dependency versions
   - Use deterministic package installation
   - Document all build requirements

2. **Docker Optimization**
   - Leverage layer caching effectively
   - Minimize image size with multi-stage builds
   - Use `.dockerignore` to exclude unnecessary files

3. **Debugging Strategies**
   - Enable verbose logging during builds
   - Inspect container filesystem after failures
   - Test with minimal configurations first

## Related Files

### Core Configuration
- `apps/strapi/Dockerfile` - Custom Docker configuration
- `docker/docker-compose.yml` - Service definitions and orchestration
- `apps/strapi/.dockerignore` - Controls build context
- `apps/strapi/package.json` - Project dependencies and scripts

### Attempted Solutions
- `docker/.pnpmfile.cjs` - pnpm hooks configuration
- `apps/strapi/.npmrc` - pnpm/npm configuration
- `apps/strapi/.env` - Environment variables

### Documentation
- `_docs/front_end_best_practices/_infrastructure_cms/strapi/` - Project documentation
- `_debug/docker_deployment.md` - This debug log

## References

### Official Documentation
- [Strapi Docker Documentation](https://docs.strapi.io/dev-docs/installation/docker)
- [pnpm Docker Integration](https://pnpm.io/docker)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

### Community Resources
- [pnpm GitHub Discussions](https://github.com/pnpm/pnpm/discussions/4539)
- [Strapi GitHub Issues](https://github.com/strapi/strapi/issues?q=is%3Aissue+docker+pnpm)
- [Docker for Node.js Developers](https://www.docker.com/blog/containerized-development-best-practices/)

### Troubleshooting Guides
- [Debugging Node.js in Docker](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [pnpm Troubleshooting](https://pnpm.io/troubleshooting)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)

## Appendix: Useful Commands

### Docker Commands
```bash
# Build with no cache
docker-compose -f docker/docker-compose.yml build --no-cache

# Run with shell access
docker-compose -f docker/docker-compose.yml run --rm --service-ports strapi sh

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Clean up
docker system prune -a --volumes
```

### pnpm Commands
```bash
# Install with scripts
pnpm install --ignore-scripts=false

# Check for vulnerable packages
pnpm audit

# List installed packages
pnpm list --depth=0
```