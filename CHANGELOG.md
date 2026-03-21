# Changelog

## Unreleased

- Tests: Add unit tests for `fetchSupplyCounts()` and normalize legacy payloads.
- Core: `fetchSupplyCounts()` now skips invalid entries instead of throwing.
- Demos: Bootstrapping updated to fetch counts from counts2.json and use the `news` folder count as `totalSupply`.
- Docs: README updated with preferred `SupplyCount` fields and migration notes.
