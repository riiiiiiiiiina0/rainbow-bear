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

// Load saved settings or defaults
function loadOptions() {
  chrome.storage.sync.get('highlightColors', (data) => {
    const colors = data.highlightColors || defaultColors;
    themes.forEach(theme => {
      document.getElementById(`${theme}-highlight`).value = colors[theme]?.highlight || defaultColors[theme].highlight;
      document.getElementById(`${theme}-text`).value = colors[theme]?.text || defaultColors[theme].text;
    });
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

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
