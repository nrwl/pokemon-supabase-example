import { test, expect } from '@playwright/test';
import { initTests } from './test-utils';

test.describe('pokedex', () => {
  initTests();

  test.describe('homepage', () => {
    test('should see 151 pokemon cards', async ({ page }) => {
      await page.goto('http://localhost:9999');
      const pokemonCardLocator = page.locator('.pokemon-card');
      await expect(pokemonCardLocator).toHaveCount(151);
    });

    test('clicking a card should link to the detail page', async ({ page }) => {
      await page.goto('http://localhost:9999');
      const charizardLocator = page.locator('.pokemon-card', {
        hasText: 'Charizard',
      });
      await charizardLocator.click();
      await page.waitForURL('http://localhost:9999/pokemon/6', {
        timeout: 1000,
      });
    });
  });

  test.describe('detail page', () => {
    test('charizard should have the move: "growl"', async ({ page }) => {
      await page.goto('http://localhost:9999/pokemon/6');
      2;
      const growlMoveLocator = page.locator('.move', { hasText: 'Growl' });
      await expect(growlMoveLocator).toHaveCount(1);
    });
  });
});
