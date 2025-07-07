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

// Load initial styles
chrome.storage.sync.get('highlightColors', (data) => {
  const currentColors = data.highlightColors || defaultColors;
  applyStyles(currentColors);
});

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.highlightColors) {
    applyStyles(changes.highlightColors.newValue || defaultColors);
  }
});
