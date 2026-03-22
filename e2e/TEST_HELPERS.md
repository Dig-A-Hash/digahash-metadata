Tests helpers
-
This project keeps shared Playwright test helpers under `e2e/helpers` to avoid duplicating behavior across framework demo specs.

New helper:
- `e2e/helpers/fetchTwiceAndAssert20.ts` — provides `assertFetchingTwiceYields20(page)` which navigates to `/`, clicks the `Fetch Next Batch` button twice and asserts there are 20 `.card` elements.

Guidance for contributors:
- Import helpers in your spec: `import { assertFetchingTwiceYields20 } from './helpers/fetchTwiceAndAssert20';`
- Keep helpers focused, deterministic, and side-effect free outside the page instance they operate on.
