(function () {
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

  // Animation & color-blind support removed – no pattern constants required.

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
        cssVariables.push(
          `--${theme}-highlight: ${colors[theme].highlight} !important;`,
        );
        cssVariables.push(`--${theme}-text: ${colors[theme].text} !important;`);
      }
    }

    // Color-blind mode no longer supported; related styles removed.

    dynamicStyle.textContent = `:root { ${cssVariables.join(' ')} }`;
  }

  // Animated highlight feature removed.

  // Load initial settings
  chrome.storage.sync.get(['highlightColors'], (data) => {
    const currentColors = data.highlightColors || defaultColors;

    applyStyles(currentColors);
  });

  // Listen for changes in storage
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      // Get current settings to ensure we have all values when one changes
      chrome.storage.sync.get(['highlightColors'], (data) => {
        const currentColors = data.highlightColors || defaultColors;

        if (changes.highlightColors) {
          applyStyles(currentColors);
          console.log(
            'Better Notion Highlights: Highlight colors or color blind mode updated.',
          );
        }
      });
      // animatedHighlightsEnabled changes no longer relevant
    }
  });
})();
