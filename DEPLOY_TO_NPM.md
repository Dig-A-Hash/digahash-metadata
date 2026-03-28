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

Publish from an existing session (recommended)

If you already have an interactive npm session inside the `workspace` container, run these two commands to publish:

```bash
docker compose exec workspace sh -lc 'pnpm --filter @digahash/metadata-core publish --access public --no-git-checks'

docker compose exec workspace sh -lc 'pnpm -r --filter=!@digahash/metadata-core publish --access public --no-git-checks'
```

Start container, install and build (if needed)

```bash
docker compose up -d workspace
docker compose exec workspace sh -lc "pnpm install"
docker compose exec workspace sh -lc "pnpm -r build"
```

Interactive container login (if you need to create a session)

Use this only when you need an interactive login (you'll be prompted for password and 2FA). Always logout when finished to avoid leaving credentials in the container.

```bash
docker compose exec -it workspace sh -lc "npm login --registry=https://registry.npmjs.org"
docker compose exec workspace sh -lc "npm whoami --registry=https://registry.npmjs.org"
docker compose exec workspace sh -lc "npm logout --registry=https://registry.npmjs.org"
```

CI recommendation

For automated CI/CD publishing prefer Trusted Publishing (OIDC) via your CI provider (GitHub Actions, GitLab, CircleCI). This removes the need for long-lived npm tokens. See https://docs.npmjs.com/trusted-publishers for configuration details.

Security note

- Do not commit `~/.npmrc` or any tokens to the repository.  
- If you used an automation token for a test publish, revoke or rotate it after use.

If you want, I can also add a GitHub Actions example for Trusted Publishing to this document.
