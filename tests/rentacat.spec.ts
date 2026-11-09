import { test, expect, Page } from '@playwright/test';

const URL = 'http://localhost:8080/';

async function setCookies(page: Page, c1: boolean, c2: boolean, c3: boolean) {
    await page.evaluate(
    ([a, b, c]) => {
        document.cookie = `1=${a}`;
        document.cookie = `2=${b}`;
        document.cookie = `3=${c}`;
        
    },
    [c1, c2, c3]
    );
}

test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await setCookies(page, false, false, false);
});

test('TEST-CONNECTION', async ({ page }) => {
  await page.goto(URL);
});
 
test('TEST-1-RESET', async ({ page }) => {
    // Preconditions: cats 1, 2, 3 are rented.
    await setCookies(page, true, true, true);
 
    // Execution steps
    await page.getByRole('link', { name: 'Reset' }).click();
 
    // Postconditions
    const items = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');  await expect(items.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();

    const photos = page.getByRole('list', { name: 'Cat photos' }).getByRole('listitem');
    await expect(photos.nth(1).getByRole('img')).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
 
    const items = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');  await expect(items).toHaveCount(3);
    await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
});
 
test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
 
    await expect(page.getByRole('button', { name: 'Rent', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return', exact: true })).toBeVisible();
});
 
test('TEST-5-RENT', async ({ page }) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.locator('#rentID').fill('1');
    await page.getByRole('button', { name: 'Rent', exact: true }).click();
 
    const items = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');  await expect(items.nth(0)).toHaveText('Rented out');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
    await expect(page.getByText('Success!')).toBeVisible();
});
 
test('TEST-6-RETURN', async ({ page }) => {
    // Preconditions: cats 2 and 3 are rented.
    await setCookies(page, false, true, true);
    
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    // cat2?
    await page.locator('#returnID').fill('2');
    await page.getByRole('button', { name: 'Return', exact: true }).click();
 
    const items = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');  await expect(items.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('Rented out');
    await expect(page.getByText('Success!')).toBeVisible();
});
 
test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    
    await expect(page.getByRole('button', { name: 'Feed', exact: true })).toBeVisible();
});
 
test('TEST-8-FEED', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.locator('#catnips').fill('6');
    await page.getByRole('button', { name: 'Feed', exact: true }).click();
    
    // The cats take about 7 seconds to eat, so wait up to 10 seconds.
    await expect(page.getByText('Nom, nom, nom.')).toBeVisible({ timeout: 10000 });
});
 
test('TEST-9-GREET-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    
    await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();
});
 
test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.goto(URL + 'greet-a-cat/Jennyanydots');
 
    await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
});
 
test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    // Preconditions: cats 1, 2, 3 are rented.
    await setCookies(page, true, true, true);
 
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
 
    await expect(page.locator('body')).toHaveScreenshot();
});

/*
test('DEFECT1-FUN-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await page.locator('#catnips').fill('0');
  await page.getByRole('button', { name: 'Feed', exact: true }).click();

  await expect(page.getByText('Cat fight!')).toBeVisible({ timeout: 10000 });
});

test('DEFECT2-FUN-GREET-A-CAT', async ({ page }) => {
  await setCookies(page, true, false, false); // cat 1 rented
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

  await expect(page.getByText('Meow!Meow!', { exact: true })).toBeVisible();
});

test('DEFECT3-FUN-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await setCookies(page, true, false, false); // cat 1 (Jennyanydots) rented
  await page.goto(URL + 'greet-a-cat/Jennyanydots');

  await expect(page.getByText('Jennyanydots is not here.')).toBeVisible();
});
*/
