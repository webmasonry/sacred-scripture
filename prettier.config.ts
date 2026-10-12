import type { Config, Options } from "prettier";

const options: Options = {
  arrowParens: "always",
  bracketSameLine: true,
  bracketSpacing: true,
  checkIgnorePragma: false,
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  experimentalOperatorPosition: "end",
  experimentalTernaries: false,
  htmlWhitespaceSensitivity: "strict",
  jsxSingleQuote: false,
  objectWrap: "preserve",
  printWidth: 80,
  proseWrap: "always",
  quoteProps: "as-needed",
  semi: true,
  singleAttributePerLine: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
};

export default {
  overrides: [
    {
      files: "*.astro",
      options: {
        ...options,
        parser: "astro",
        plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
        tailwindStylesheet: "./src/styles/global.css"
      },
    },
    {
      files: "*.css",
      options: {
        parser: "css",
        plugins: [],
      },
    },
    {
      files: "*.html",
      options: {
        parser: "html",
        plugins: [],
      },
    },
    {
      files: "*.{js,jsx}",
      options: {
        parser: "babel",
        plugins: [],
      },
    },
    {
      files: "*.json",
      options: {
        parser: "json",
        plugins: [],
      },
    },
    {
      files: "*.jsonc",
      options: {
        parser: "jsonc",
        plugins: [],
      },
    },
    {
      files: "*.md",
      options: {
        parser: "markdown",
        plugins: [],
      },
    },
    {
      files: "*.mdx",
      options: {
        parser: "mdx",
        plugins: [],
      },
    },
    {
      files: "*.scss",
      options: {
        parser: "scss",
        plugins: [],
      },
    },
    {
      files: "*.{ts,tsx}",
      options: {
        parser: "typescript",
        plugins: [],
      },
    },
    {
      files: "*.vue",
      options: {
        parser: "vue",
        plugins: [],
      },
    },
    {
      files: "*.{yaml,yml}",
      options: {
        parser: "yaml",
        plugins: [],
      },
    },
  ],
} as Config;
