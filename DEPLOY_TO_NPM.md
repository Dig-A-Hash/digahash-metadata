# Deploying packages to npm

This document explains how to publish the packages in this monorepo to npm. The repo uses a pnpm workspace and (per project policy) Node/pnpm must be run inside Docker.

Summary
- You can publish per-package from the repo root using `pnpm --filter` or publish many packages at once with `pnpm -r publish`.
- Typical order: publish `metadata-core` first (other packages generally depend on it), then publish the framework wrappers.

Prerequisites
- An npm account with publish permission for the target scope/name.
- An npm token (with publish rights). Keep this secret. Do NOT commit tokens to the repo.
- Ensure each package you intend to publish has:
  - `name` and `version` in `package.json`
  - `private: false` (or absent)
  - build step (if needed) that produces the published artifacts

Build steps (run from repo root, inside Docker)

Install deps (Docker):

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim pnpm install
```

Build all packages:

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim pnpm -r build
```

Publish options

1) Publish a single package (from repo root, using a filter)

- Replace `@scope/name` with the package `name` in `package.json` or use a path-like filter `./packages/metadata-core`.
- Provide your npm token via `NPM_TOKEN` environment variable.

```bash
export NPM_TOKEN="<your_token>"
docker run --rm -it -v "$(pwd):/app" -w /app -e NPM_TOKEN="$NPM_TOKEN" node:24-slim bash -lc \
  "npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm --filter @digahash/metadata-core publish --access public --no-git-checks"
```

2) Publish all packages that are ready (workspace-wide)

```bash
export NPM_TOKEN="<your_token>"
docker run --rm -it -v "$(pwd):/app" -w /app -e NPM_TOKEN="$NPM_TOKEN" node:24-slim bash -lc \
  "npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm -r publish --access public --no-git-checks"
```

Notes:
- `--access public` is required for scoped public packages; omit or change as needed for private packages.
- `--no-git-checks` skips pnpm's default git checks; remove it if you prefer to keep git verification.

Versioning
- Ensure `package.json` versions are updated before publishing. Use your preferred versioning flow (manual `version` bump, `npm version`, `pnpm version`, or a tool like Changesets).
- If you change `metadata-core`, bump and publish it first. Then update dependent wrapper packages to reference the new `metadata-core` version, build, and publish them.

Token and 2FA
- If your npm account has 2FA set to "publish" required, you must either use an automation token that bypasses interactive 2FA (recommended for CI) or perform the publish from a session that can supply the OTP when prompted. Prefer creating an automation token in npm for CI use.
- Do not store tokens in the repo. Use environment variables or your CI secret store.

Generating an NPM_TOKEN
- Recommended (web UI):
  1. Sign in at https://www.npmjs.com.
  2. Open your profile → "Access Tokens" (or go to https://www.npmjs.com/settings/<your-username>/tokens).
  3. Click "Create New Token" → select the **Automation** token type and grant **Publish** (or "Read and Publish") as needed.
  4. Create the token and copy it immediately. Store it in your CI secrets (GitHub/GitLab), a password manager, or another secure secret store.

- CLI (interactive):
  - Run interactive commands inside Docker to avoid using Node on the host:

```bash
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim bash -lc "npm login"
```

  - After login you can create a token with `npm token create` (this may prompt for 2FA). Creating automation tokens via the CLI can still require web steps depending on your account security settings — the web UI is generally the most reliable.

- Verify the token (example):
  - In a shell, set `NPM_TOKEN` and test `npm whoami` inside Docker:

```bash
export NPM_TOKEN="<your_token>"
docker run --rm -it -v "$(pwd):/app" -w /app -e NPM_TOKEN="$NPM_TOKEN" node:24-slim bash -lc \
  "npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && npm whoami"
```

- CI notes:
  - Store the token in your CI provider's secret store (e.g., `NPM_TOKEN` in GitHub Actions Secrets) and reference it in workflows. Do not commit tokens to the repository or paste them in public chats.

Troubleshooting & common gotchas
- If a package has `private: true`, npm will refuse to publish it. Remove or set to `false` for publishing.
- Ensure `files` or `build` outputs are present in the package before publishing.
- If dependencies in a wrapper package point to `workspace:` protocol, ensure the published package replaces that dependency with a proper semver (update `package.json` before publishing wrappers).

Quick publish checklist
- [ ] Bump versions
- [ ] Run `pnpm -r build` (inside Docker)
- [ ] Set `NPM_TOKEN` and test `npm whoami` inside Docker
- [ ] Publish `metadata-core` first
- [ ] Publish wrappers (`metadata-vue`, `metadata-react`, `metadata-angular`)

Example: publish `metadata-core` then `metadata-vue`

```bash
export NPM_TOKEN="<token>"
# build
docker run --rm -it -v "$(pwd):/app" -w /app node:24-slim pnpm -r build

# publish core
docker run --rm -it -v "$(pwd):/app" -w /app -e NPM_TOKEN="$NPM_TOKEN" node:24-slim bash -lc \
  "npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm --filter @digahash/metadata-core publish --access public --no-git-checks"

# update wrappers if needed, then publish
docker run --rm -it -v "$(pwd):/app" -w /app -e NPM_TOKEN="$NPM_TOKEN" node:24-slim bash -lc \
  "npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && pnpm --filter @digahash/metadata-vue publish --access public --no-git-checks"
```

