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
      }
    },
  );
}

// Save settings
function saveOptions() {
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

  const animatedToggle = document.getElementById('animated-highlights-toggle');
  const animatedHighlightsEnabled =
    animatedToggle instanceof HTMLInputElement ? animatedToggle.checked : false;

  const colorBlindToggle = document.getElementById('color-blind-mode-toggle');
  const colorBlindModeEnabled =
    colorBlindToggle instanceof HTMLInputElement
      ? colorBlindToggle.checked
      : false;

  chrome.storage.sync.set(
    {
      highlightColors: newColors,
      animatedHighlightsEnabled: animatedHighlightsEnabled,
      colorBlindModeEnabled: colorBlindModeEnabled,
    },
    () => {
      // Add a status message element if it doesn't exist
      let status = document.getElementById('status-message');
      if (!status) {
        status = document.createElement('p');
        status.id = 'status-message';
        status.className = 'text-center mt-4 text-sm font-medium';
        // Insert status message after the save button container
        const saveButtonContainer = document.querySelector(
          '.flex.justify-center.mt-8',
        );
        if (saveButtonContainer && saveButtonContainer.parentNode) {
          saveButtonContainer.parentNode.insertBefore(
            status,
            saveButtonContainer.nextSibling,
          );
        } else {
          // Fallback if the specific container isn't found
          const mainElement = document.querySelector('main');
          if (mainElement) {
            mainElement.appendChild(status);
          }
        }
      }
      status.textContent = 'Settings saved.';
      status.style.color = 'var(--status-success)';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
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

  chrome.storage.sync.set(
    {
      highlightColors: defaultColors,
      animatedHighlightsEnabled: false,
      colorBlindModeEnabled: false,
    },
    () => {
      let status = document.getElementById('status-message');
      if (!status) {
        status = document.createElement('p');
        status.id = 'status-message';
        status.className = 'text-center mt-4 text-sm font-medium';
        const saveButtonContainer = document.querySelector(
          '.flex.justify-center.mt-8',
        );
        if (saveButtonContainer && saveButtonContainer.parentNode) {
          saveButtonContainer.parentNode.insertBefore(
            status,
            saveButtonContainer.nextSibling,
          );
        } else {
          const mainElement = document.querySelector('main');
          if (mainElement) {
            mainElement.appendChild(status);
          }
        }
      }
      status.textContent = 'Colors reset to defaults and saved.';
      status.style.color = 'var(--status-warning)';
      setTimeout(() => {
        status.textContent = '';
      }, 3000);
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

// Function to add event listeners to color inputs
function addColorInputListeners() {
  themes.forEach((theme) => {
    const bgInput = document.getElementById(`${theme}-bg`);
    const textInput = document.getElementById(`${theme}-text`);

    if (bgInput && bgInput instanceof HTMLInputElement) {
      bgInput.addEventListener('input', () => updatePreview(theme));
    }
    if (textInput && textInput instanceof HTMLInputElement) {
      textInput.addEventListener('input', () => updatePreview(theme));
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

  // The save button in the new template is the first button in the main section
  const saveButton = document.querySelector('main button.btn-primary'); // More specific selector
  if (saveButton) {
    saveButton.addEventListener('click', saveOptions);
  } else {
    console.error('Save button not found');
  }

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
      chrome.storage.sync.set({ animatedHighlightsEnabled: enabled }, () => {
        console.log(`Animated highlights ${enabled ? 'enabled' : 'disabled'}`);
        // Optionally, provide feedback to the user here, though saveOptions already does.
        // For immediate feedback on toggle, we might want a separate small status message or rely on the main save.
      });
    });
  }

  // Event listener for the color blind mode toggle - save on change
  const colorBlindToggle = document.getElementById('color-blind-mode-toggle');
  if (colorBlindToggle && colorBlindToggle instanceof HTMLInputElement) {
    colorBlindToggle.addEventListener('change', () => {
      const enabled = colorBlindToggle.checked;
      chrome.storage.sync.set({ colorBlindModeEnabled: enabled }, () => {
        console.log(`Color blind mode ${enabled ? 'enabled' : 'disabled'}`);
      });
    });
  }
});
