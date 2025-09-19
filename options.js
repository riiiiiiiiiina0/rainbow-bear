// Default color values from styles.css (original values)
const defaultColors = {
  gray: { highlight: '#dcdcdc', text: '#000000' },
  brown: { highlight: '#986a33', text: '#ffffff' },
  orange: { highlight: '#ff9351', text: '#ffffff' },
  yellow: { highlight: '#faff72', text: '#000000' },
  green: { highlight: '#74de2e', text: '#000000' },
  blue: { highlight: '#3da5ff', text: '#ffffff' },
  purple: { highlight: '#bf51e2', text: '#ffffff' },
  pink: { highlight: '#ff74bc', text: '#ffffff' },
  red: { highlight: '#ff3737', text: '#ffffff' },
};

const themes = [
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
];

// Dark mode functionality
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function loadTheme() {
  const systemTheme = getSystemTheme();
  setTheme(systemTheme);
}

function handleSystemThemeChange(e) {
  const systemTheme = e.matches ? 'dark' : 'light';
  setTheme(systemTheme);
}

function populateInputs(colorsToLoad) {
  themes.forEach((theme) => {
    const bgInput = document.getElementById(`${theme}-bg`);
    const textInput = document.getElementById(`${theme}-text`);
    if (bgInput && bgInput instanceof HTMLInputElement) {
      bgInput.value =
        colorsToLoad[theme]?.highlight || defaultColors[theme].highlight;
    }
    if (textInput && textInput instanceof HTMLInputElement) {
      textInput.value = colorsToLoad[theme]?.text || defaultColors[theme].text;
    }
  });
}

// Load saved settings or defaults
function loadOptions() {
  chrome.storage.sync.get(['highlightColors'], (data) => {
    const colors = data.highlightColors || defaultColors;
    populateInputs(colors);

    // No animated highlight or color-blind options to load
  });
}

// Reset settings to defaults
function resetOptions() {
  populateInputs(defaultColors);
  // Save default colors only
  chrome.storage.sync.set({ highlightColors: defaultColors }, () => {});
}

// Function to update preview span for a specific theme
function updatePreview(theme) {
  const bgInput = document.getElementById(`${theme}-bg`);
  const textInput = document.getElementById(`${theme}-text`);

  if (
    bgInput &&
    bgInput instanceof HTMLInputElement &&
    textInput &&
    textInput instanceof HTMLInputElement
  ) {
    const bgColor = bgInput.value;
    const textColor = textInput.value;

    // Find the preview span by looking for the input's parent container and finding the span within it
    const container = bgInput.closest('.card');
    const previewSpan = container
      ? container.querySelector('span.font-semibold')
      : null;

    if (previewSpan && previewSpan instanceof HTMLElement) {
      previewSpan.style.backgroundColor = bgColor;
      previewSpan.style.color = textColor;
    }
  }
}

// Function to update all previews
function updateAllPreviews() {
  themes.forEach((theme) => {
    updatePreview(theme);
  });
}

// Pattern and animation preview helpers removed – no longer required

// Function to save colors automatically
function saveColors() {
  const newColors = {};
  themes.forEach((theme) => {
    const bgInput = document.getElementById(`${theme}-bg`);
    const textInput = document.getElementById(`${theme}-text`);
    if (
      bgInput &&
      bgInput instanceof HTMLInputElement &&
      textInput &&
      textInput instanceof HTMLInputElement
    ) {
      newColors[theme] = {
        highlight: bgInput.value,
        text: textInput.value,
      };
    }
  });

  chrome.storage.sync.set({ highlightColors: newColors }, () => {
    // Colors saved automatically, no status message needed
  });
}

// Function to update preview and save colors
function updatePreviewAndSave(theme) {
  updatePreview(theme);
  saveColors();
}

// Function to add event listeners to color inputs
function addColorInputListeners() {
  themes.forEach((theme) => {
    const bgInput = document.getElementById(`${theme}-bg`);
    const textInput = document.getElementById(`${theme}-text`);

    if (bgInput && bgInput instanceof HTMLInputElement) {
      bgInput.addEventListener('input', () => updatePreviewAndSave(theme));
    }
    if (textInput && textInput instanceof HTMLInputElement) {
      textInput.addEventListener('input', () => updatePreviewAndSave(theme));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Load theme first
  loadTheme();

  // Load color options
  loadOptions();

  // Add event listeners for live preview updates
  addColorInputListeners();

  // Update previews initially
  setTimeout(() => {
    updateAllPreviews();
  }, 100);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleSystemThemeChange);

  // Add reset button functionality
  const resetButton = document.getElementById('reset-defaults');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetOptions();
      // Update previews after reset
      setTimeout(() => {
        updateAllPreviews();
      }, 100);
    });
  } else {
    console.error('Reset button not found');
  }

  // No toggle listeners – feature removed
});
