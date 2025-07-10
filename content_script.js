const STYLE_ID = 'notion-highlighter-custom-styles';

// Default color values (should match options.js and styles.css for consistency if storage is empty)
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

// Color blind patterns (extracted from color-blind.html)
const colorBlindPatterns = {
  gray: 'repeating-linear-gradient(45deg, #ccc, #ccc 2px, transparent 2px, transparent 5px)',
  brown: 'repeating-linear-gradient(0deg, #8B4513 0 5px, #D2B48C 5px 10px)',
  orange:
    'repeating-linear-gradient(45deg, orange, orange 1px, transparent 1px, transparent 4px), repeating-linear-gradient(-45deg, orange, orange 1px, transparent 1px, transparent 4px)',
  yellow:
    'repeating-radial-gradient(circle, #ff0 0px, #ff0 2px, transparent 2px, transparent 6px)',
  green:
    'repeating-linear-gradient(90deg, #0f0, #0f0 2px, transparent 2px, transparent 5px)',
  blue: 'repeating-linear-gradient(0deg, #00f, #00f 2px, transparent 2px, transparent 5px)',
  purple:
    'repeating-linear-gradient(135deg, purple, purple 2px, transparent 2px, transparent 5px)',
  pink: 'repeating-radial-gradient(circle, pink 0 1px, transparent 1px 4px)',
  red: 'repeating-linear-gradient(0deg, red, red 1px, transparent 1px, transparent 5px), repeating-linear-gradient(90deg, red, red 1px, transparent 1px, transparent 5px)',
};

function applyStyles(colors, colorBlindModeEnabled = false) {
  let dynamicStyle = document.getElementById(STYLE_ID);
  if (!dynamicStyle) {
    dynamicStyle = document.createElement('style');
    dynamicStyle.id = STYLE_ID;
    document.head.appendChild(dynamicStyle);
  }

  const cssVariables = [];
  let colorBlindStyles = '';

  for (const theme in colors) {
    if (colors[theme] && colors[theme].highlight && colors[theme].text) {
      cssVariables.push(
        `--${theme}-highlight: ${colors[theme].highlight} !important;`,
      );
      cssVariables.push(`--${theme}-text: ${colors[theme].text} !important;`);
    }
  }

  // Add color blind pattern styles if enabled
  if (colorBlindModeEnabled) {
    // Add a class to body to enable color blind mode
    document.body.classList.add('color-blind-mode-active');

    colorBlindStyles = `
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(248, 248, 247, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(248, 248, 247)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(47, 47, 47, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(47, 47, 47)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(84, 72, 49, 0.15)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(255, 255, 255, 0.13)'] {
        background-image: ${colorBlindPatterns.gray} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(244, 238, 238, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(244, 238, 238)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(74, 50, 40, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(74, 50, 40)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(210, 162, 141, 0.35)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(184, 101, 67, 0.45)'] {
        background-image: ${colorBlindPatterns.brown} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(251, 236, 221, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(251, 236, 221)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(92, 59, 35, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(92, 59, 35)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(224, 124, 57, 0.27)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(233, 126, 35, 0.45)'] {
        background-image: ${colorBlindPatterns.orange} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(251, 243, 219, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(251, 243, 219)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(86, 67, 40, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(86, 67, 40)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(236, 191, 66, 0.39)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(250, 177, 67, 0.5)'] {
        background-image: ${colorBlindPatterns.yellow} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(237, 243, 236, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(237, 243, 236)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(63, 68, 68, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(63, 68, 68)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(123, 183, 129, 0.27)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(45, 153, 100, 0.5)'] {
        background-image: ${colorBlindPatterns.green} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(231, 243, 248, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(231, 243, 248)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(51, 61, 72, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(51, 61, 72)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(93, 165, 206, 0.27)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(51, 126, 169, 0.5)'] {
        background-image: ${colorBlindPatterns.blue} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(248, 243, 252, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(248, 243, 252)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(73, 50, 82, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(73, 50, 82)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(168, 129, 197, 0.27)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(168, 91, 242, 0.34)'] {
        background-image: ${colorBlindPatterns.purple} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(252, 241, 246, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(252, 241, 246)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(83, 59, 76, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(83, 59, 76)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(225, 136, 179, 0.27)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(220, 76, 145, 0.4)'] {
        background-image: ${colorBlindPatterns.pink} !important;
        background-size: 8px 8px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
      
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(253, 235, 236, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(253, 235, 236)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background:rgba(89, 54, 56, 1)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgb(89, 54, 56)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(244, 171, 159, 0.4)'],
      .color-blind-mode-active *:not(nav):not(nav *)[style*='background: rgba(222, 85, 83, 0.45)'] {
        background-image: ${colorBlindPatterns.red} !important;
        background-size: 10px 10px !important;
        background-repeat: repeat !important;
        text-shadow: 0 0 1px #fff, 0 0 2px #fff !important;
      }
    `;
  } else {
    // Remove the color blind mode class if disabled
    document.body.classList.remove('color-blind-mode-active');
  }

  const rootStyles = `:root { ${cssVariables.join(' ')} }`;

  dynamicStyle.textContent = rootStyles + colorBlindStyles;
}

function toggleAnimationClass(enabled) {
  if (enabled) {
    document.body.classList.add('animated-highlights-active');
    console.log('Better Notion Highlights: Animations enabled.');
  } else {
    document.body.classList.remove('animated-highlights-active');
    console.log('Better Notion Highlights: Animations disabled.');
  }
}

// Load initial settings
chrome.storage.sync.get(
  ['highlightColors', 'animatedHighlightsEnabled', 'colorBlindModeEnabled'],
  (data) => {
    const currentColors = data.highlightColors || defaultColors;
    const colorBlindModeEnabled =
      data.colorBlindModeEnabled === undefined
        ? false
        : data.colorBlindModeEnabled;

    applyStyles(currentColors, colorBlindModeEnabled);

    const animatedEnabled =
      data.animatedHighlightsEnabled === undefined
        ? false
        : data.animatedHighlightsEnabled;
    toggleAnimationClass(animatedEnabled);
  },
);

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    // Get current settings to ensure we have all values when one changes
    chrome.storage.sync.get(
      ['highlightColors', 'colorBlindModeEnabled'],
      (data) => {
        const currentColors = data.highlightColors || defaultColors;
        const colorBlindModeEnabled =
          data.colorBlindModeEnabled === undefined
            ? false
            : data.colorBlindModeEnabled;

        if (changes.highlightColors || changes.colorBlindModeEnabled) {
          applyStyles(currentColors, colorBlindModeEnabled);
          console.log(
            'Better Notion Highlights: Highlight colors or color blind mode updated.',
          );
        }
      },
    );

    if (changes.animatedHighlightsEnabled) {
      toggleAnimationClass(changes.animatedHighlightsEnabled.newValue);
    }
  }
});
