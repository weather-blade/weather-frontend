FROM node:22.10.0-bullseye-slim as builder
RUN apt-get update && apt-get upgrade -y
RUN npm -g install pnpm@9.12.2

WORKDIR /app

# get dependencies first separately
COPY package.json pnpm-lock.yaml ./

# rotate right chart axis label by 180˚ (PI)
COPY patches patches

RUN pnpm install --frozen-lockfile

# the rest of the source code needed for building
COPY . .

RUN pnpm run build


FROM node:22.10.0-bullseye-slim as deployment
RUN apt-get update && apt-get upgrade -y
RUN npm -g install pnpm@9.12.2

# keep only the needed files
COPY --from=builder /app/build /app/build

WORKDIR /app
ENV NODE_ENV production
