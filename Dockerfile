FROM node:22-alpine AS dev
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install
COPY . .
RUN pnpm build

FROM node:22-alpine AS prod
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production
COPY --from=dev /app/dist ./dist

CMD ["node", "dist/main.js"]
