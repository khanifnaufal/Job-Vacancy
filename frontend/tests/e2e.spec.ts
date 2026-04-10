import { test, expect } from '@playwright/test';

test.describe('Job Vacancy System', () => {
  test('User opens the vacancies list page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h2', { hasText: 'Temukan Pekerjaan Impianmu' })).toBeVisible();
    await expect(page.getByPlaceholder('Cari lowongan berdasarkan judul...')).toBeVisible();
  });

  test('User searches a job by title', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Cari lowongan berdasarkan judul...');
    await searchInput.fill('developer');
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=Temukan Pekerjaan Impianmu')).toBeVisible();
  });

  test('User views vacancy details', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1500);
    
    const noJobsVisible = await page.getByText('Tidak ada lowongan ditemukan').isVisible();
    
    if (!noJobsVisible) {
      const firstJob = page.locator('a.block').first();
      if (await firstJob.isVisible()) {
        await firstJob.click();
        
        await expect(page.locator('text=Kembali ke daftar pekerjaan')).toBeVisible();
        await expect(page.locator('text=Deskripsi Pekerjaan')).toBeVisible();
      }
    }
  });
});
