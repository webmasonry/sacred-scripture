import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: "node",
    exclude: [
      "**/*.spec.ts",
      "**/.astro/**",
      "**/dist/**",
      "**/node_modules/**",
    ],
    globals: true,
    include: ["./tests/vitest/**/*.test.ts"],
  },
});