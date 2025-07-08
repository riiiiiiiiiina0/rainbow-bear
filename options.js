// Default color values from styles.css (original values)
const defaultColors = {
  gray: { highlight: '#dcdcdc', text: '#000000' },
  brown: { highlight: '#986a33', text: '#ffffff' },
  orange: { highlight: '#ff9351', text: '#000000' },
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
  chrome.storage.sync.get(
    ['highlightColors', 'animatedHighlightsEnabled', 'colorBlindModeEnabled'],
    (data) => {
      const colors = data.highlightColors || defaultColors;
      populateInputs(colors);

      const animatedHighlightsEnabled =
        data.animatedHighlightsEnabled === undefined
          ? false
          : data.animatedHighlightsEnabled;
      const animatedToggle = document.getElementById(
        'animated-highlights-toggle',
      );
      if (animatedToggle && animatedToggle instanceof HTMLInputElement) {
        animatedToggle.checked = animatedHighlightsEnabled;

        // Set initial animation preview state
        if (animatedHighlightsEnabled) {
          enableAnimationPreviews();
        } else {
          disableAnimationPreviews();
        }
      }

      const colorBlindModeEnabled =
        data.colorBlindModeEnabled === undefined
          ? false
          : data.colorBlindModeEnabled;
      const colorBlindToggle = document.getElementById(
        'color-blind-mode-toggle',
      );
      if (colorBlindToggle && colorBlindToggle instanceof HTMLInputElement) {
        colorBlindToggle.checked = colorBlindModeEnabled;

        // Set initial pattern preview state
        if (colorBlindModeEnabled) {
          enableColorBlindPatterns();
        } else {
          disableColorBlindPatterns();
        }
      }
    },
  );
}

// Reset settings to defaults
function resetOptions() {
  populateInputs(defaultColors);
  // Also reset the animation toggle and color blind mode toggle to their defaults (false)
  const animatedToggle = document.getElementById('animated-highlights-toggle');
  if (animatedToggle && animatedToggle instanceof HTMLInputElement) {
    animatedToggle.checked = false;
  }

  const colorBlindToggle = document.getElementById('color-blind-mode-toggle');
  if (colorBlindToggle && colorBlindToggle instanceof HTMLInputElement) {
    colorBlindToggle.checked = false;
  }

  // Reset animation and pattern previews
  disableAnimationPreviews();
  disableColorBlindPatterns();

  // Save all settings including colors
  chrome.storage.sync.set(
    {
      highlightColors: defaultColors,
      animatedHighlightsEnabled: false,
      colorBlindModeEnabled: false,
    },
    () => {
      // Settings reset and saved automatically
    },
  );
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

// Color blind pattern preview functions
function enableColorBlindPatterns() {
  const patternPreviews = document.querySelectorAll('.pattern-preview');
  patternPreviews.forEach((preview) => {
    preview.classList.add('color-blind-active');
  });
}

function disableColorBlindPatterns() {
  const patternPreviews = document.querySelectorAll('.pattern-preview');
  patternPreviews.forEach((preview) => {
    preview.classList.remove('color-blind-active');
  });
}

// Animation preview functions
function enableAnimationPreviews() {
  const patternPreviews = document.querySelectorAll('.pattern-preview');
  console.log('Enabling animations for', patternPreviews.length, 'elements');
  patternPreviews.forEach((preview) => {
    preview.classList.add('animated-active');
    console.log(
      'Added animated-active to element with classes:',
      preview.className,
    );
  });
}

function disableAnimationPreviews() {
  const patternPreviews = document.querySelectorAll('.pattern-preview');
  console.log('Disabling animations for', patternPreviews.length, 'elements');
  patternPreviews.forEach((preview) => {
    preview.classList.remove('animated-active');
    console.log(
      'Removed animated-active from element with classes:',
      preview.className,
    );
  });
}

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

  // Event listener for the animated highlights toggle - save on change
  const animatedToggle = document.getElementById('animated-highlights-toggle');
  if (animatedToggle && animatedToggle instanceof HTMLInputElement) {
    animatedToggle.addEventListener('change', () => {
      const enabled = animatedToggle.checked;

      // Update animation preview visibility
      if (enabled) {
        enableAnimationPreviews();
      } else {
        disableAnimationPreviews();
      }

      chrome.storage.sync.set({ animatedHighlightsEnabled: enabled }, () => {
        console.log(`Animated highlights ${enabled ? 'enabled' : 'disabled'}`);
      });
    });
  }

  // Event listener for the color blind mode toggle - save on change
  const colorBlindToggle = document.getElementById('color-blind-mode-toggle');
  if (colorBlindToggle && colorBlindToggle instanceof HTMLInputElement) {
    colorBlindToggle.addEventListener('change', () => {
      const enabled = colorBlindToggle.checked;

      // Update pattern preview visibility
      if (enabled) {
        enableColorBlindPatterns();
      } else {
        disableColorBlindPatterns();
      }

      chrome.storage.sync.set({ colorBlindModeEnabled: enabled }, () => {
        console.log(`Color blind mode ${enabled ? 'enabled' : 'disabled'}`);
      });
    });
  }
});
