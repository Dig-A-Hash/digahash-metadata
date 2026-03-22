import { expect, test } from '@playwright/test';
import { assertFetchBatchRenders442Layout } from './helpers/fetchBatchLayout';
import { assertCardsHaveParseableDates } from './helpers/assertCardDates';
import { assertLoadingIndicatorTurnsYesDuringFetch } from './helpers/assertLoadingIndicator';
import { assertFetchingTwiceYields20 } from './helpers/fetchTwiceAndAssert20';

test('renders the react demo shell', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'React Metadata Demo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fetch Next Batch' })).toBeVisible();
    await expect(page.getByText('Fetch a batch to preview the cards.')).toBeVisible();
});

test('renders a 4-4-2 card layout after fetching a batch', async ({ page }) => {
    await assertFetchBatchRenders442Layout(page);
});

test('each card shows a parseable date in the react demo', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Fetch Next Batch' }).click();
    await assertCardsHaveParseableDates(page);
});

test('fetching twice yields 20 cards in the react demo', async ({ page }) => {
    await assertFetchingTwiceYields20(page);
});

test('loading changes to yes while the react demo batch request is in flight', async ({ page }) => {
    await assertLoadingIndicatorTurnsYesDuringFetch(page);
});
