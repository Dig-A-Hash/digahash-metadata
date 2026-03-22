import { expect, test } from '@playwright/test';
import { assertFetchBatchRenders442Layout } from './helpers/fetchBatchLayout';
import { assertCardsHaveParseableDates } from './helpers/assertCardDates';

test('renders the angular demo shell', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Angular Metadata Demo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fetch Next Batch' })).toBeVisible();
    await expect(page.getByText('Fetch a batch to preview the cards.')).toBeVisible();
});

test('renders a 4-4-2 card layout after fetching a batch', async ({ page }) => {
    await assertFetchBatchRenders442Layout(page);
});

test('each card shows a parseable date in the angular demo', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Fetch Next Batch' }).click();
    await assertCardsHaveParseableDates(page);
});
