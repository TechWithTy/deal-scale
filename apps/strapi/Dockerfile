FROM node:18-alpine

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Enable pnpm
RUN corepack enable

WORKDIR /opt/app

# Copy the entire application source code
COPY . .

# Install dependencies. pnpm will find the .pnpmfile.cjs and package.json
RUN pnpm install --ignore-scripts=false

ENV PATH /opt/app/node_modules/.bin:$PATH

RUN pnpm build

EXPOSE 1337

CMD ["pnpm", "develop"]
