// Default color values from styles.css
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
  'gray', 'brown', 'orange', 'yellow', 'green',
  'blue', 'purple', 'pink', 'red'
];

function populateInputs(colorsToLoad) {
  themes.forEach(theme => {
    document.getElementById(`${theme}-highlight`).value = colorsToLoad[theme]?.highlight || defaultColors[theme].highlight;
    document.getElementById(`${theme}-text`).value = colorsToLoad[theme]?.text || defaultColors[theme].text;
  });
}

// Load saved settings or defaults
function loadOptions() {
  chrome.storage.sync.get('highlightColors', (data) => {
    const colors = data.highlightColors || defaultColors;
    populateInputs(colors);
  });
}

// Save settings
function saveOptions() {
  const newColors = {};
  themes.forEach(theme => {
    newColors[theme] = {
      highlight: document.getElementById(`${theme}-highlight`).value,
      text: document.getElementById(`${theme}-text`).value,
    };
  });

  chrome.storage.sync.set({ highlightColors: newColors }, () => {
    const status = document.getElementById('status-message');
    status.textContent = 'Settings saved.';
    status.style.color = 'green';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

// Reset settings to defaults
function resetOptions() {
  // Populate inputs with default colors
  populateInputs(defaultColors);

  // Save these default colors to storage
  chrome.storage.sync.set({ highlightColors: defaultColors }, () => {
    const status = document.getElementById('status-message');
    status.textContent = 'Colors reset to defaults and saved.';
    status.style.color = 'orange'; // Use a different color to distinguish from save
    // Note: The content script will pick up this change from storage automatically.
    // If we want the reset to be "harder" (i.e., immediately affect Notion pages),
    // this save to storage is correct.
    // If we only wanted to reset the UI and let user "Save" them, we'd omit this storage.sync.set.
    // The current plan implies saving defaults to storage on reset.
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset-defaults').addEventListener('click', resetOptions);
