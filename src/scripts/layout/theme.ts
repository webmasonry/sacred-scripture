type Theme = "light" | "dark";

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function updateThemeIcons(theme: Theme): void {
  const lightThemeIcon = document.querySelector<HTMLElement>(
    '[data-trigger="theme light"]',
  );
  const darkThemeIcon = document.querySelector<HTMLElement>(
    '[data-trigger="theme dark"]',
  );

  if (!lightThemeIcon || !darkThemeIcon) return;

  const showLightIcon = theme === "light";
  lightThemeIcon.classList.toggle("hidden", !showLightIcon);
  lightThemeIcon.setAttribute("aria-hidden", String(!showLightIcon));
  darkThemeIcon.classList.toggle("hidden", showLightIcon);
  darkThemeIcon.setAttribute("aria-hidden", String(showLightIcon));
}

export function initThemeToggle(): void {
  const themeButton = document.querySelector<HTMLButtonElement>(
    '[data-trigger="theme toggle"]',
  );
  if (!themeButton) return;

  const initialTheme: Theme =
    document.documentElement.classList.contains("light") ? "light" : "dark";
  updateThemeIcons(initialTheme);

  themeButton.addEventListener("click", () => {
    const currentTheme: Theme =
      document.documentElement.classList.contains("light") ? "light" : "dark";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    window.localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
    updateThemeIcons(nextTheme);
  });
}
