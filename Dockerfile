FROM node:18.17.1-bullseye-slim as builder
RUN apt-get update && apt-get upgrade -y
RUN npm -g install pnpm@8.7.6

WORKDIR /app

# get dependencies first separately
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# the rest of the source code needed for building
COPY . .

RUN pnpm run build


FROM node:18.17.1-bullseye-slim as deployment
RUN apt-get update && apt-get upgrade -y
RUN npm -g install pnpm@8.7.6

# keep only the needed files
COPY --from=builder /app/build /app/build

WORKDIR /app
ENV NODE_ENV production
