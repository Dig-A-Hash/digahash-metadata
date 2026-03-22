import { expect, Page } from '@playwright/test';

const metadataPathPattern = '**/meta-data/137/news/**';

export async function assertLoadingIndicatorTurnsYesDuringFetch(page: Page): Promise<void> {
    // inject a fetch wrapper to delay metadata JSON requests so transient loading becomes observable
    await page.addInitScript(() => {
        const origFetch = window.fetch;
        // @ts-ignore
        window.fetch = function (...args: any[]) {
            try {
                const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
                if (typeof url === 'string' && url.includes('/meta-data/137/news/')) {
                    return new Promise((resolve) => setTimeout(() => resolve(origFetch.apply(this, args)), 500));
                }
            } catch {
                // swallow
            }
            // @ts-ignore
            return origFetch.apply(this, args);
        };
    });

    // route as an additional safety net for delaying network responses
    await page.route(metadataPathPattern, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.continue();
    });

    await page.goto('/');

    const loadingValue = page
        .locator('.status-row p')
        .filter({ hasText: 'Loading:' })
        .locator('strong');

    await expect(loadingValue).toHaveText('no');

    await page.getByRole('button', { name: 'Fetch Next Batch' }).click();

    await expect.poll(async () => {
        return (await loadingValue.textContent())?.trim();
    }, {
        message: 'Expected the loading indicator to switch to "yes" while the delayed metadata batch request is in flight.'
    }).toBe('yes');

    await expect(page.locator('.card')).toHaveCount(10);
    await expect(loadingValue).toHaveText('no');
}