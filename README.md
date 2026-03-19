# digahash-metadata

Monorepo for multi framework metadata libraries providing tools to publish web content from simple hosted JSON files that are sequentially numbered. This approach can eliminate the need for a more expensive separate database in website development.

This repo provides packages for [Angular][angular], [Vue][vue], [React][react], and [Vanilla JavaScript][vanillajs].

## Packages

This repository contains four framework specific wrapper packages that integrate with `@digahash/metadata-core`

* `@digahash/metadata angular` the Angular service wrapper
* `@digahash/metadata vue` the Vue 3 composable wrapper
* `@digahash/metadata react` the React hook wrapper
* `@digahash/metadata core` the Vanilla JavaScript core package

Demo applications demonstrating usage for each framework are included under the `apps` folder for Vanilla JS, Vue, React, and Angular

## Demo Apps

Run demo apps in Docker when you want to run a single demo in isolation. See each demo folder for development details and exact run commands.

## Preferred Workflow Docker Desktop and Compose

Use this workflow when you want one Docker project with all demo services available in Docker Desktop. This is the primary workflow for day to day local development.

All developer commands run in Docker so no host Nodejs installation is required.

Basic steps for a first time setup

```bash
# first time setup or after dependency changes
docker compose down
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim sh -lc "corepack enable && pnpm install"

# start rebuild services
docker compose up --build

# normal restart after images are built
docker compose up
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

[angular]: https://angular.io
[vue]: https://vuejs.org
[react]: https://reactjs.org
[vanillajs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript

## License

MIT
