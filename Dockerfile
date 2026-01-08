FROM node:20-alpine

WORKDIR /app

RUN corepack enable

RUN pnpm config set node-linker=hoisted

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .
RUN pnpm build

EXPOSE 3000
