FROM node:24-slim

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

CMD ["tail", "-f", "/dev/null"]
