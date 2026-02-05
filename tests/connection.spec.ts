import { test, expect } from '@playwright/test';

test('connection', async ({ page }) => {
  await page.goto('http://localhost:3000/ar');
  await page.getByRole('link', { name: 'تسجيل الدخول' }).click();
  await page.getByRole('textbox', { name: 'هاتف' }).click();
  await page.getByRole('textbox', { name: 'هاتف' }).fill('32347872');
  await page.getByRole('textbox', { name: 'كلمة المرور' }).click();
  await page.getByRole('textbox', { name: 'كلمة المرور' }).fill('12345678');
  await page.getByRole('main').getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'الدخول للاعلانات الآن' }).click();
  await expect(page).toHaveURL('http://localhost:3000/ar/my/list');
});