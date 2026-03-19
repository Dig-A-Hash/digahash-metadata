# digahash-metadata

Monorepo for multi-framework metadata libraries under the @digahash scope.

## Preferred Workflow (Docker Desktop / Compose)

Use this when you want one Docker project with all demo services available in Docker Desktop.
This is the primary workflow for day-to-day local development.

All commands run in Docker. No host Node.js installation is required.

```bash
# first-time setup (or after dependency changes)
docker compose down
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm install"

# start/rebuild services (Docker Desktop Play equivalent)
docker compose up --build

# normal restart after images are built
docker compose up
```

When running, demos are available at:

- Vanilla: http://localhost:4173
- Vue: http://localhost:4174
- React: http://localhost:4175
- Angular: http://localhost:4200

## Packages

- @digahash/metadata-core
- @digahash/metadata-vue
- @digahash/metadata-react
- @digahash/metadata-angular

## Common Commands

Use these for one-off monorepo tasks (build, test, release), not for long-running demo servers.

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm -r build"
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm -r test"
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm changeset"
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm changeset:version"
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm changeset:publish"
```

## Demo Apps

Use these when you want to run one demo app by itself in a temporary container:

```bash
docker run --rm -it -p 4173:4173 -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter demo-vanilla dev -- --host 0.0.0.0 --port 4173"
docker run --rm -it -p 4174:4174 -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter demo-vue dev -- --host 0.0.0.0 --port 4174"
docker run --rm -it -p 4175:4175 -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter demo-react dev -- --host 0.0.0.0 --port 4175"
docker run --rm -it -p 4200:4200 -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm --filter demo-angular dev -- --host 0.0.0.0 --port 4200"
```

## Release Process

1. Add a changeset.
2. Run changeset version.
3. Review version bumps and changelogs.
4. Publish packages to npm.

## Package READMEs

- packages/metadata-core/README.md
- packages/metadata-vue/README.md
- packages/metadata-react/README.md
- packages/metadata-angular/README.md

## License

MIT
