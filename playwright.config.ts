import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "edge",
      use: {
        ...devices["Desktop Edge"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "safari",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
  reporter: "html",
  retries: process.env.CI ? 2 : 0,
  testMatch: "**/*.spec.ts",
  tsconfig: "./tsconfig.json",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm run dev",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    url: "http://localhost:4321",
  },
  workers: process.env.CI ? 1 : 0,
});
