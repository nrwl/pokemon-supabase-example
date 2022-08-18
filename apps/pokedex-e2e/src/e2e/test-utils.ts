import { exec } from 'child_process';
import { test } from '@playwright/test';

export function initTests(seedBetweenEachTest = false) {
  test.beforeAll(async () => {
    await startSupabase();
  });

  test.beforeEach(async () => {
    if (seedBetweenEachTest) {
      await seedDb();
    }
  });
}

function startSupabase() {
  return new Promise<void>((resolve) => {
    exec('npx nx start pokemon-db', (err) => {
      if (err) {
        console.log('supabase was already running');
      } else {
        console.log('supabase started');
      }
      resolve();
    });
  });
}

function seedDb() {}
