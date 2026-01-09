import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
});

test('has title', async ({ page }) => {
    // Check the title of the page
    await expect(page).toHaveTitle(/Grid Defender/);
});

test('displays home page header', async ({ page }) => {
    // Verify the main header text is present
    await expect(page.getByRole('heading', { name: /GRID DEFENDER/i })).toBeVisible();
});

test('has tutorial button', async ({ page }) => {
    // Verify the tutorial button exists
    const tutorialBtn = page.getByRole('button', { name: /Tutorial/i });
    await expect(tutorialBtn).toBeVisible();

    // Click it and verify modal appears (assuming it has standard accessibility traits)
    await tutorialBtn.click();
    await expect(page.getByRole('heading', { name: /Tutorial/i })).toBeVisible();
});

test('can navigate to a map', async ({ page }) => {
    // Find the first "START" button and click it
    // Since there are multiple maps, we can use the first one or a specific map name
    const firstMapStartBtn = page.getByRole('button', { name: /START/i }).first();
    await expect(firstMapStartBtn).toBeVisible();

    await firstMapStartBtn.click();

    // Verify navigation to the play page
    await expect(page).toHaveURL(/\/play\//);
});
