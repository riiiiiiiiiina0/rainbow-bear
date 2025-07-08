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

function applyStyles(colors) {
  let dynamicStyle = document.getElementById(STYLE_ID);
  if (!dynamicStyle) {
    dynamicStyle = document.createElement('style');
    dynamicStyle.id = STYLE_ID;
    document.head.appendChild(dynamicStyle);
  }

  const cssVariables = [];
  for (const theme in colors) {
    if (colors[theme] && colors[theme].highlight && colors[theme].text) {
      cssVariables.push(`--${theme}-highlight: ${colors[theme].highlight} !important;`);
      cssVariables.push(`--${theme}-text: ${colors[theme].text} !important;`);
    }
  }

  dynamicStyle.textContent = `:root { ${cssVariables.join(' ')} }`;
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
chrome.storage.sync.get(['highlightColors', 'animatedHighlightsEnabled'], (data) => {
  const currentColors = data.highlightColors || defaultColors;
  applyStyles(currentColors);

  const animatedEnabled = data.animatedHighlightsEnabled === undefined ? false : data.animatedHighlightsEnabled;
  toggleAnimationClass(animatedEnabled);
});

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.highlightColors) {
      applyStyles(changes.highlightColors.newValue || defaultColors);
      console.log('Better Notion Highlights: Highlight colors updated.');
    }
    if (changes.animatedHighlightsEnabled) {
      toggleAnimationClass(changes.animatedHighlightsEnabled.newValue);
    }
  }
});
