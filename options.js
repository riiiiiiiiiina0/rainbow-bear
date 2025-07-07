// Default color values from styles.css (original values)
const defaultColors = {
  gray: { bg: '#dcdcdc', text: '#000000' }, // highlight was bg
  brown: { bg: '#986a33', text: '#ffffff' }, // highlight was bg
  orange: { bg: '#ff9351', text: '#000000' },// highlight was bg
  yellow: { bg: '#faff72', text: '#000000' },// highlight was bg
  green: { bg: '#74de2e', text: '#000000' }, // highlight was bg
  blue: { bg: '#3da5ff', text: '#ffffff' },  // highlight was bg
  purple: { bg: '#bf51e2', text: '#ffffff' },// highlight was bg
  pink: { bg: '#ff74bc', text: '#ffffff' },  // highlight was bg
  red: { bg: '#ff3737', text: '#ffffff' },   // highlight was bg
};

const themes = [
  'gray', 'brown', 'orange', 'yellow', 'green',
  'blue', 'purple', 'pink', 'red'
];

function populateInputs(colorsToLoad) {
  themes.forEach(theme => {
    document.getElementById(`${theme}-bg`).value = colorsToLoad[theme]?.bg || defaultColors[theme].bg;
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
      bg: document.getElementById(`${theme}-bg`).value,
      text: document.getElementById(`${theme}-text`).value,
    };
  });

  chrome.storage.sync.set({ highlightColors: newColors }, () => {
    // Add a status message element if it doesn't exist
    let status = document.getElementById('status-message');
    if (!status) {
      status = document.createElement('p');
      status.id = 'status-message';
      status.className = 'text-center mt-4 text-sm font-medium';
      // Insert status message after the save button container
      const saveButtonContainer = document.querySelector('.flex.justify-center.mt-8');
      if (saveButtonContainer && saveButtonContainer.parentNode) {
        saveButtonContainer.parentNode.insertBefore(status, saveButtonContainer.nextSibling);
      } else {
        // Fallback if the specific container isn't found
        document.querySelector('main').appendChild(status);
      }
    }
    status.textContent = 'Settings saved.';
    status.style.color = 'green';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

// Reset settings to defaults
function resetOptions() {
  populateInputs(defaultColors);
  chrome.storage.sync.set({ highlightColors: defaultColors }, () => {
    let status = document.getElementById('status-message');
    if (!status) {
      status = document.createElement('p');
      status.id = 'status-message';
      status.className = 'text-center mt-4 text-sm font-medium';
      const saveButtonContainer = document.querySelector('.flex.justify-center.mt-8');
       if (saveButtonContainer && saveButtonContainer.parentNode) {
        saveButtonContainer.parentNode.insertBefore(status, saveButtonContainer.nextSibling);
      } else {
        document.querySelector('main').appendChild(status);
      }
    }
    status.textContent = 'Colors reset to defaults and saved.';
    status.style.color = 'orange';
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  // The save button in the new template is the first button in the main section
  const saveButton = document.querySelector('main button');
  if (saveButton) {
    saveButton.addEventListener('click', saveOptions);
  } else {
    console.error("Save button not found");
  }

  // Add reset button functionality - creating it as it's not in the new template by default
  const buttonContainer = document.querySelector('.flex.justify-center.mt-8');
  if (buttonContainer) {
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-defaults';
    resetButton.textContent = 'Restore to Defaults';
    // Apply Tailwind classes for styling to match the save button, but with a secondary color
    resetButton.className = 'flex items-center justify-center rounded-md h-10 px-6 bg-slate-500 text-white text-sm font-semibold shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 ml-4';
    resetButton.addEventListener('click', resetOptions);
    buttonContainer.appendChild(resetButton);
  } else {
    console.error("Button container not found for reset button");
  }
});
