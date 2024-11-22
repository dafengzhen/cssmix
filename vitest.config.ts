import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ['src/cssmix.ts'],
      reporter: ['text', 'html', 'clover', 'json', 'json-summary'],
      reportOnFailure: true,
    },
  },
});
