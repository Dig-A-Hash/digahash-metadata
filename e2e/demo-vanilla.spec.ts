import { expect, test } from '@playwright/test';

test('renders the vanilla demo shell', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Vanilla Metadata Demo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fetch Next Batch' })).toBeVisible();
    await expect(page.getByText('Fetch a batch to preview the cards.')).toBeVisible();
});
