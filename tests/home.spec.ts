import { test, expect } from '@playwright/test';

test.describe('Home Page Happy Paths', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have correct page title', async ({ page }) => {
        await expect(page).toHaveTitle(/Grid Defender/);
    });

    test('should display main game header', async ({ page }) => {
        await expect(page.getByRole('heading', { name: "GRID DEFENDER" })).toBeVisible();
    });

    test('should open and close Tutorial modal', async ({ page }) => {
        await page.getByRole('button', { name: /Tutorial/i }).click();
        await expect(page.getByRole('heading', { name: /GRID DEFENDER GUIDE/i })).toBeVisible();

        // Close modal (assuming it closes on Escape or has a close button)
        await page.keyboard.press('Escape');
        await expect(page.getByRole('heading', { name: /GRID DEFENDER GUIDE/i })).not.toBeVisible();
    });

    test('should open Achievements modal', async ({ page }) => {
        await page.getByRole('button', { name: /Achievements/i }).click();
        await expect(page.getByRole('heading', { name: /ACHIEVEMENTS/i })).toBeVisible();
    });

    test('should open Patch Notes modal', async ({ page }) => {
        await page.getByRole('button', { name: /Patch Notes/i }).click();
        await expect(page.getByRole('heading', { name: /PATCH NOTES/i })).toBeVisible();
    });

    test('should have a working support link', async ({ page }) => {
        const supportLink = page.getByRole('link', { name: /Support Developer/i }).first();
        await expect(supportLink).toBeVisible();
        await expect(supportLink).toHaveAttribute('href', /ko-fi\.com/);
    });

    test('should navigate to map selection and start game', async ({ page }) => {
        const firstMapStartBtn = page.getByRole('button', { name: /START/i }).first();
        await expect(firstMapStartBtn).toBeVisible();
        await firstMapStartBtn.click();
        await expect(page).toHaveURL(/\/play\//);
    });
});
