import { expect, Page } from '@playwright/test';

export async function assertFetchBatchRenders442Layout(page: Page): Promise<void> {
    await page.goto('/');

    await page.getByRole('button', { name: 'Fetch Next Batch' }).click();

    const rows = page.locator('.card-row');
    const cards = page.locator('.card');

    await expect(cards).toHaveCount(10);
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0).locator('.card')).toHaveCount(4);
    await expect(rows.nth(1).locator('.card')).toHaveCount(4);
    await expect(rows.nth(2).locator('.card')).toHaveCount(2);

    const firstRowFirstCard = rows.nth(0).locator('.card').first();
    const lastRowFirstCard = rows.nth(2).locator('.card').first();
    const widthTolerancePx = 8;


    await expect
        .poll(async () => {
            const firstRowWidth = (await firstRowFirstCard.boundingBox())?.width ?? 0;
            const lastRowWidth = (await lastRowFirstCard.boundingBox())?.width ?? 0;
            return lastRowWidth - firstRowWidth;
        })
        .toBeGreaterThan(widthTolerancePx);
}