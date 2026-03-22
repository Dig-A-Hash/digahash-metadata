import { expect, Page } from '@playwright/test';

export async function assertCardsHaveParseableDates(page: Page): Promise<void> {
    const cards = page.locator('.card');
    const cardCount = await cards.count();
    for (let i = 0; i < cardCount; i++) {
        const dateEl = cards.nth(i).locator('.date-added');
        await expect(dateEl).toBeVisible();
        const dateText = (await dateEl.textContent()) ?? '';
        expect(dateText.trim().length).toBeGreaterThan(0);
        const parsed = Date.parse(dateText.trim());
        expect(Number.isNaN(parsed)).toBeFalsy();
    }
}
