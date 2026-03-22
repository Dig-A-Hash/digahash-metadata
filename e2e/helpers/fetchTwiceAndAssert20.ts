import { expect, Page } from '@playwright/test';

export async function assertFetchingTwiceYields20(page: Page): Promise<void> {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Fetch Next Batch' });
    await button.click();
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(10);
    await button.click();
    await expect(cards).toHaveCount(20);
}
