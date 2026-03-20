# Deploying packages to npm

This document explains how to publish the packages in this monorepo to npm. The repo uses a pnpm workspace and (per project policy) Node/pnpm must be run inside Docker.



Install deps (run inside the persistent `workspace` container):

```bash
docker compose exec workspace sh -lc "pnpm install"
```

Build all packages (run inside the persistent `workspace` container):

```bash
docker compose exec workspace sh -lc "pnpm -r build"
```

Secure publish workflow (single recommended approach)

Use the commands below exactly in order. This keeps your token out of host shell history and removes it from npm config inside the container after publishing.

1) Ensure the persistent `workspace` container is running:

```bash
docker compose up -d workspace
```

2) Install dependencies in the running `workspace` container:

```bash
docker compose exec workspace sh -lc "pnpm install"
```

3) Build all packages in the running `workspace` container:

```bash
docker compose exec workspace sh -lc "pnpm -r build"
```

4) Publish `@digahash/metadata-core` securely :

```bash
docker compose exec -it workspace sh -lc 'read -s -p "NPM token: " NPM_TOKEN; echo; npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm --filter @digahash/metadata-core publish --access public --no-git-checks && npm config delete //registry.npmjs.org/:_authToken'
```

5) Publish remaining packages securely (workspace-wide, excluding `metadata-core`):

```bash
docker compose exec -it workspace sh -lc 'read -s -p "NPM token: " NPM_TOKEN; echo; npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm -r --filter=!@digahash/metadata-core publish --access public --no-git-checks && npm config delete //registry.npmjs.org/:_authToken'
```

Generate an npm token (from your npm account)

1) Sign in at https://www.npmjs.com
2) Open your profile settings and go to Access Tokens:
	- https://www.npmjs.com/settings/your-username/tokens
3) Click Create New Token.
4) Choose Automation token and grant publish access.
5) Create the token and copy it immediately.
6) Use that token only at the `NPM token:` prompt in the publish commands.

Example: publish `metadata-core` first, then remaining packages (same secure flow)

```bash
docker compose up -d workspace

docker compose exec workspace sh -lc "pnpm install"

docker compose exec workspace sh -lc "pnpm -r build"

# publish core first
docker compose exec -it workspace sh -lc 'read -s -p "NPM token: " NPM_TOKEN; echo; npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm --filter @digahash/metadata-core publish --access public --no-git-checks && npm config delete //registry.npmjs.org/:_authToken'

# publish all remaining packages (exclude core)
docker compose exec -it workspace sh -lc 'read -s -p "NPM token: " NPM_TOKEN; echo; npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm -r --filter=!@digahash/metadata-core publish --access public --no-git-checks && npm config delete //registry.npmjs.org/:_authToken'
```
