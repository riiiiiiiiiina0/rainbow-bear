// Apply system theme immediately to prevent flash
(function () {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  document.documentElement.setAttribute('data-theme', systemTheme);
})();
