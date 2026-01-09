import { test, expect } from '@playwright/test';

test.describe('Game Play Happy Paths', () => {
    test.beforeEach(async ({ page }) => {
        // Start from the home page and enter the first map
        await page.goto('/');

        // Wait for loading screen to finish (Home page header to be visible)
        await expect(page.getByRole('heading', { name: "GRID DEFENDER" })).toBeVisible({ timeout: 10000 });

        // Navigate to the first map
        await page.getByRole('button', { name: /START/i }).first().click();
        await expect(page).toHaveURL(/\/play\//);
    });

    test('should display initial game stats', async ({ page }) => {
        // Check initial coins (100)
        await expect(page.locator('.coin-display + span')).toHaveText('100');
        // Check initial lives (10)
        await expect(page.locator('.lucide-heart + span')).toHaveText('10');
        // Check initial wave (1)
        await expect(page.getByText(/WAVE 1/i)).toBeVisible();
    });

    test('should be able to place a defender and see coins decrease', async ({ page }) => {
        // Select Warrior from shop (Standard cost: 50)
        await page.getByRole('button', { name: /Warrior/i }).click();

        // Click a cell on the grid (nth(10) to avoid the path cells which are usually first few)
        // Note: This relies on the first few cells not being path. In Golem Lair, (0,5) is start.
        // Cell at index 0 is (0,0), which is usually safe in Golem Lair.
        const cell = page.locator('.game-cell').first();
        await cell.click();

        // Check if coins decreased to 50 (100 - 50)
        await expect(page.locator('.coin-display + span')).toHaveText('50');

        // Check if defender emoji is visible in that cell
        await expect(cell.getByText('⚔️')).toBeVisible();
    });

    test('should be able to start a wave and pause the game', async ({ page }) => {
        const startBtn = page.getByRole('button', { name: "START" });
        await expect(startBtn).toBeVisible();
        await startBtn.click();

        // After starting, the button should change to PAUSE
        const pauseBtn = page.getByRole('button', { name: "PAUSE" });
        await expect(pauseBtn).toBeVisible();

        // Click Pause and verify the pause modal appears
        await pauseBtn.click();
        await expect(page.getByRole('heading', { name: "PAUSED" })).toBeVisible();

        // Resume game
        await page.getByRole('button', { name: /Resume/i }).click();
        await expect(page.getByRole('heading', { name: "PAUSED" })).not.toBeVisible();
    });
});
