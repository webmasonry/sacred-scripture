function setDrawerOpen(
  drawer: HTMLElement,
  button: HTMLButtonElement,
  isOpen: boolean,
): void {
  drawer.classList.toggle("hidden", !isOpen);
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-pressed", String(isOpen));

  if (drawer.id === "bible-drawer") {
    drawer.classList.toggle("flex", isOpen);
  }
}

export function initDrawerControls(): void {
  const bibleButton = document.querySelector<HTMLButtonElement>(
    '[data-trigger="bible drawer"]',
  );
  const bibleDrawer = document.querySelector<HTMLElement>(
    '[data-target="bible drawer"]',
  );
  const navigationButton = document.querySelector<HTMLButtonElement>(
    '[data-trigger="navigation drawer"]',
  );
  const navigationDrawer = document.querySelector<HTMLElement>(
    'nav[data-target="navigation drawer"]',
  );

  if (bibleButton && bibleDrawer) {
    bibleButton.addEventListener("click", () => {
      const shouldOpen = bibleDrawer.classList.contains("hidden");

      if (shouldOpen && navigationButton && navigationDrawer) {
        setDrawerOpen(navigationDrawer, navigationButton, false);
      }

      setDrawerOpen(bibleDrawer, bibleButton, shouldOpen);
    });
  }

  if (navigationButton && navigationDrawer) {
    navigationButton.addEventListener("click", () => {
      const shouldOpen = navigationDrawer.classList.contains("hidden");

      if (shouldOpen && bibleButton && bibleDrawer) {
        setDrawerOpen(bibleDrawer, bibleButton, false);
      }

      setDrawerOpen(navigationDrawer, navigationButton, shouldOpen);
    });
  }
}
