const STYLE_ID = 'notion-highlighter-custom-styles';

// Default settings (should match options.js for consistency if storage is empty)
const defaultSettings = {
  gray: { highlight: '#dcdcdc', text: '#000000', pattern: 'none', animation: 'none' },
  brown: { highlight: '#986a33', text: '#ffffff', pattern: 'none', animation: 'none' },
  orange: { highlight: '#ff9351', text: '#000000', pattern: 'none', animation: 'none' },
  yellow: { highlight: '#faff72', text: '#000000', pattern: 'none', animation: 'none' },
  green: { highlight: '#74de2e', text: '#000000', pattern: 'none', animation: 'none' },
  blue: { highlight: '#3da5ff', text: '#ffffff', pattern: 'none', animation: 'none' },
  purple: { highlight: '#bf51e2', text: '#ffffff', pattern: 'none', animation: 'none' },
  pink: { highlight: '#ff74bc', text: '#ffffff', pattern: 'none', animation: 'none' },
  red: { highlight: '#ff3737', text: '#ffffff', pattern: 'none', animation: 'none' },
};

// Mapping Notion's default background RGB values to our theme names
const notionBgToTheme = {
  'rgba(248, 248, 247, 1)': 'gray', // Light gray
  'rgb(248, 248, 247)': 'gray',
  'rgba(47, 47, 47, 1)': 'gray', // Dark gray
  'rgb(47, 47, 47)': 'gray',
  'rgba(244, 238, 238, 1)': 'brown', // Light brown
  'rgb(244, 238, 238)': 'brown',
  'rgba(74, 50, 40, 1)': 'brown', // Dark brown
  'rgb(74, 50, 40)': 'brown',
  'rgba(251, 236, 221, 1)': 'orange', // Light orange
  'rgb(251, 236, 221)': 'orange',
  'rgba(92, 59, 35, 1)': 'orange', // Dark orange
  'rgb(92, 59, 35)': 'orange',
  'rgba(251, 243, 219, 1)': 'yellow', // Light yellow
  'rgb(251, 243, 219)': 'yellow',
  'rgba(86, 67, 40, 1)': 'yellow', // Dark yellow
  'rgb(86, 67, 40)': 'yellow',
  'rgba(237, 243, 236, 1)': 'green', // Light green
  'rgb(237, 243, 236)': 'green',
  'rgba(36, 61, 48, 1)': 'green', // Dark green
  'rgb(36, 61, 48)': 'green',
  'rgba(231, 243, 248, 1)': 'blue', // Light blue
  'rgb(231, 243, 248)': 'blue',
  'rgba(20, 58, 78, 1)': 'blue', // Dark blue
  'rgb(20, 58, 78)': 'blue',
  'rgba(248, 243, 252, 1)': 'purple', // Light purple
  'rgb(248, 243, 252)': 'purple',
  'rgba(60, 45, 73, 1)': 'purple', // Dark purple
  'rgb(60, 45, 73)': 'purple',
  'rgba(252, 241, 246, 1)': 'pink', // Light pink
  'rgb(252, 241, 246)': 'pink',
  'rgba(78, 44, 60, 1)': 'pink', // Dark pink
  'rgb(78, 44, 60)': 'pink',
  'rgba(253, 235, 236, 1)': 'red', // Light red
  'rgb(253, 235, 236)': 'red',
  'rgba(82, 46, 42, 1)': 'red', // Dark red
  'rgb(82, 46, 42)': 'red',
};


function applyStyles(settings, colorBlindModeEnabled = false, animatedHighlightsEnabled = false) {
  let dynamicStyle = document.getElementById(STYLE_ID);
  if (!dynamicStyle) {
    dynamicStyle = document.createElement('style');
    dynamicStyle.id = STYLE_ID;
    document.head.appendChild(dynamicStyle);
  }

  const cssVariables = [];
  for (const themeName in settings) {
    if (settings[themeName] && settings[themeName].highlight && settings[themeName].text) {
      cssVariables.push(
        `--${themeName}-highlight: ${settings[themeName].highlight} !important;`,
      );
      cssVariables.push(`--${themeName}-text: ${settings[themeName].text} !important;`);
    }
  }
  const rootStyles = `:root { ${cssVariables.join(' ')} }`;
  dynamicStyle.textContent = rootStyles;

  // Toggle global animation class on body
  if (animatedHighlightsEnabled) {
    document.body.classList.add('animated-highlights-active');
  } else {
    document.body.classList.remove('animated-highlights-active');
  }

  // Toggle global color blind mode class on body (for potential text shadow)
  if (colorBlindModeEnabled) {
    document.body.classList.add('color-blind-mode-active');
  } else {
    document.body.classList.remove('color-blind-mode-active');
  }

  // Apply specific patterns and animations
  const notionPageContent = document.querySelector('.notion-page-content');
  if (notionPageContent) {
    const elementsToStyle = notionPageContent.querySelectorAll('[style*="background:rgba"], [style*="background: rgb"]');

    elementsToStyle.forEach(el => {
      // Clear previous custom classes to avoid conflicts
      el.className = el.className.replace(/\bpattern-\S+/g, '').replace(/\banimation-\S+/g, '');

      const notionBgStyle = el.style.background; // e.g., "rgba(248, 248, 247, 1)" or "rgb(248, 248, 247)"

      // Find the theme name associated with this Notion background color
      let themeName = null;
      for (const bg in notionBgToTheme) {
        if (notionBgStyle.includes(bg)) {
          themeName = notionBgToTheme[bg];
          break;
        }
      }

      if (themeName && settings[themeName]) {
        const themeSetting = settings[themeName];
        // Apply pattern if not 'none' and colorBlindMode is enabled
        if (colorBlindModeEnabled && themeSetting.pattern && themeSetting.pattern !== 'none') {
          el.classList.add(`pattern-${themeSetting.pattern}`);
        }
        // Apply animation if not 'none' and animatedHighlights are enabled
        if (animatedHighlightsEnabled && themeSetting.animation && themeSetting.animation !== 'none') {
          el.classList.add(`animation-${themeSetting.animation}`);
        }
      }
    });
  }
}


// Load initial settings
chrome.storage.sync.get(
  ['highlightSettings', 'animatedHighlightsEnabled', 'colorBlindModeEnabled'],
  (data) => {
    const currentSettings = data.highlightSettings || defaultSettings;
    const colorBlindModeEnabled = data.colorBlindModeEnabled || false;
    const animatedEnabled = data.animatedHighlightsEnabled || false;

    applyStyles(currentSettings, colorBlindModeEnabled, animatedEnabled);
  },
);

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    // Reload all settings to apply changes correctly
    chrome.storage.sync.get(
      ['highlightSettings', 'animatedHighlightsEnabled', 'colorBlindModeEnabled'],
      (data) => {
        const currentSettings = data.highlightSettings || defaultSettings;
        const colorBlindModeEnabled = data.colorBlindModeEnabled || false;
        const animatedEnabled = data.animatedHighlightsEnabled || false;

        applyStyles(currentSettings, colorBlindModeEnabled, animatedEnabled);
        console.log('Better Notion Highlights: Settings updated.');
      }
    );
  }
});

// Observe DOM changes to re-apply styles if Notion dynamically loads content
const observer = new MutationObserver((mutationsList, observer) => {
    // For now, simple re-application on any observed change.
    // Could be optimized to check if relevant elements were added/changed.
    chrome.storage.sync.get(
      ['highlightSettings', 'animatedHighlightsEnabled', 'colorBlindModeEnabled'],
      (data) => {
        const currentSettings = data.highlightSettings || defaultSettings;
        const colorBlindModeEnabled = data.colorBlindModeEnabled || false;
        const animatedEnabled = data.animatedHighlightsEnabled || false;
        applyStyles(currentSettings, colorBlindModeEnabled, animatedEnabled);
      }
    );
});

// Start observing the document body for configured mutations
observer.observe(document.body, { childList: true, subtree: true });
