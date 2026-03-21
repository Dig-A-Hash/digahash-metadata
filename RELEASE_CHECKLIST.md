Release checklist

- [ ] Bump package versions (packages/* package.json)
- [ ] Run `pnpm -r build` in workspace
- [ ] Verify demos build and start
- [ ] Run unit tests (`pnpm --filter @digahash/metadata-core test`)
- [ ] Update CHANGELOG.md with release notes
- [ ] Create changeset and publish
