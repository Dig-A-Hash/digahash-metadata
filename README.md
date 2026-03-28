# digahash-metadata

Monorepo for multi framework metadata libraries providing tools to publish web content from simple hosted JSON files that are sequentially numbered. This approach can eliminate the need for a more expensive separate database in website development.

This repo provides packages for Angular, Vue, React, and Vanilla JavaScript.

<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
	<img src="https://images.dig-a-hash.com/dig-a-hash/digahash-metadata-angular.webp" width="200"  alt="digahash-metadata-angular" />
	<img src="https://images.dig-a-hash.com/dig-a-hash/digahash-metadata-vue.webp" width="200" alt="digahash-metadata-vue" />
	<img src="https://images.dig-a-hash.com/dig-a-hash/digahash-metadata-react.webp" width="200" alt="digahash-metadata-react" />
	<img src="https://images.dig-a-hash.com/dig-a-hash/digahash-metadata-js.webp" width="200"  alt="digahash-metadata-js" />
</div>

## Available Packages by Framework

This Monorepo is for developing the individual packages for each framework, that are all based on `@digahash/metadata-core`. Use the links below to obtain the version that matches your chosen framework.

- [Vanilla JS](https://www.npmjs.com/package/@digahash/metadata-core)
- [Angular](https://www.npmjs.com/package/@digahash/metadata-angular)
- [React](https://www.npmjs.com/package/@digahash/metadata-react)
- [Vue](https://www.npmjs.com/package/@digahash/metadata-vue)

## Packages

This repository contains four framework specific wrapper packages that integrate with `@digahash/metadata-core`

* `@digahash/metadata-angular` the Angular service wrapper
* `@digahash/metadata-vue` the Vue 3 composable wrapper
* `@digahash/metadata-react` the React hook wrapper
* `@digahash/metadata-core` the Vanilla JavaScript core package

Demo applications demonstrating usage for each framework are included under the `apps` folder for Vanilla JS, Vue, React, and Angular

## Demo Apps

Run demo apps in Docker when you want to run a single demo in isolation. See each demo folder for development details and exact run commands.

## Preferred Workflow Docker Desktop

Use this workflow when you want one Docker project with all demo services available in Docker Desktop. This is the primary workflow for day to day local development.

All developer commands run in Docker so no host Nodejs installation is required.

Basic steps for a first time setup

```bash
# first time setup
docker compose down
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm install"

# start rebuild services
docker compose up --build

# normal restart after images are built
docker compose up

# use the workspace container to conduct future installs
docker compose exec workspace sh -lc "pnpm install"

# use the workspace container to conduct future builds
docker compose exec workspace sh -lc "pnpm -r build"
```

When running demos are available at these local addresses

* Vanilla http://localhost:4173
* Vue http://localhost:4174
* React http://localhost:4175
* Angular http://localhost:4200

## Package READMEs

* `packages/metadata-core/README.md`
* `packages/metadata-vue/README.md`
* `packages/metadata-react/README.md`
* `packages/metadata-angular/README.md`

## Running Unit Tests (quick guide)

Preferred (Docker workspace container):

```bash
# From repo root — runs inside the workspace container
docker compose exec workspace sh -lc "cd packages/metadata-core && corepack enable && npm test"
```

Run a single test by pattern:

```bash
docker compose exec workspace sh -lc "cd packages/metadata-core && npm test -- -t fetchSupplyCounts"
```

Notes:
- The repo uses a Docker-first workflow — prefer commands above that execute inside the `workspace` container.
- Package-local testing (`cd packages/metadata-core && npm test`) also works after installing dev deps.

## Run E2E Tests in Playwright

### run all demos (grouped output, slower)
```bash
docker compose exec workspace pnpm -w run e2e:grouped
```

### run all demos (fast parallel output)
```bash
docker compose exec workspace pnpm -w run e2e:fast
```

### run default e2e script
```bash
docker compose exec workspace pnpm -w run e2e
```

Notes:
- `e2e:grouped` runs with one worker so framework output stays grouped in order: vanilla -> angular -> react -> vue.
- `e2e:fast` runs with parallel workers and is faster, but test lines are interleaved by framework.

### shared e2e helper
- Shared assertions for the "Fetch Next Batch" 10-card and 4/4/2 layout test are in `e2e/helpers/fetchBatchLayout.ts`.
- Keep cross-demo UI parity checks in shared helpers when assertions are identical, and call them from each framework-specific spec to reduce duplication.

## License

MIT