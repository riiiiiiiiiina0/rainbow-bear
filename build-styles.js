// build-styles.js
// Script to generate styles.css from a central colour definition table
// Run: `node build-styles.js`

const fs = require('fs');
const path = require('path');

/**
 * Theme definition table – keeps highlight colour, text colour, the list of
 * inline-style colour variants we need to match, and the animation used when
 * the `.animated-highlights-active` class is present.
 *
 * Notion now uses CSS custom properties (CSS variables) for colors:
 * - Text colors: var(--c-{abbrev}TexSec)
 * - Background colors: var(--ca-{abbrev}BacSecTra)
 */
const themes = [
  {
    name: 'gray',
    highlight: '#dcdcdc',
    text: 'black',
    cssVarPrefix: 'gra',
    animation: 'subtlePulse 2s infinite ease-in-out',
    setGlow: false,
  },
  {
    name: 'brown',
    highlight: '#986a33',
    text: 'white',
    cssVarPrefix: 'bro',
    animation: 'colorCycle 3s infinite linear',
    setGlow: false,
  },
  {
    name: 'orange',
    highlight: '#ff9351',
    text: 'white',
    cssVarPrefix: 'ora',
    animation: 'gentleGlow 2.2s infinite alternate',
    setGlow: true,
  },
  {
    name: 'yellow',
    highlight: '#faff72',
    text: 'black',
    cssVarPrefix: 'yel',
    animation: 'subtlePulse 2.5s infinite ease-in-out',
    setGlow: false,
  },
  {
    name: 'green',
    highlight: '#74de2e',
    text: 'black',
    cssVarPrefix: 'gre',
    animation: 'colorCycle 3.5s infinite linear',
    setGlow: false,
  },
  {
    name: 'blue',
    highlight: '#3da5ff',
    text: 'white',
    cssVarPrefix: 'blu',
    animation: 'gentleGlow 2.5s infinite alternate',
    setGlow: true,
  },
  {
    name: 'purple',
    highlight: '#bf51e2',
    text: 'white',
    cssVarPrefix: 'pur',
    animation: 'subtlePulse 1.8s infinite ease-in-out',
    setGlow: false,
  },
  {
    name: 'pink',
    highlight: '#ff74bc',
    text: 'white',
    cssVarPrefix: 'pin',
    animation: 'gentleGlow 2.8s infinite alternate',
    setGlow: true,
  },
  {
    name: 'red',
    highlight: '#ff3737',
    text: 'white',
    cssVarPrefix: 'red',
    animation: 'colorCycle 2.8s infinite linear',
    setGlow: false,
  },
];

const menuFontSize = '1.5rem';
const menuFontWeight = 'bold';

/** Helper to capitalise theme names for comment blocks */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ------------------ Static (shared) CSS blocks ------------------
const animations = `@keyframes subtlePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes colorCycle {
  0%, 100% { filter: brightness(100%); }
  25% { filter: brightness(110%) saturate(120%); }
  50% { filter: brightness(90%) saturate(80%); }
  75% { filter: brightness(105%) saturate(110%); }
}

@keyframes gentleGlow {
  0%, 100% { box-shadow: 0 0 5px 0px transparent; }
  50% { box-shadow: 0 0 10px 3px var(--current-highlight-glow, rgba(255,255,255,.5)); }
}`;

// ------------------ Build :root block ------------------
let root = [':root {'];
for (const t of themes) {
  root.push(`  /* ${cap(t.name)} theme */`);
  root.push(`  --${t.name}-highlight: ${t.highlight};`);
  root.push(`  --${t.name}-text: ${t.text};\n`);
}
root.push('  /* Menu item typography */');
root.push(`  --menu-font-size: ${menuFontSize};`);
root.push(`  --menu-font-weight: ${menuFontWeight};`);
root.push('}');

// ------------------ Build theme selector rules ------------------
const blocks = [];
for (const t of themes) {
  // Build selectors for both text color and background color using Notion's CSS variables
  const textColorSelector = `*:not(nav):not(nav *)[style*='color:var(--c-${t.cssVarPrefix}TexSec)']`;
  const bgColorSelector = `*:not(nav):not(nav *)[style*='background:var(--ca-${t.cssVarPrefix}BacSecTra)']`;

  const variantSelectors = [textColorSelector, bgColorSelector].join(',\n');

  // normal state
  let normal = `/* ${cap(
    t.name,
  )} theme */\n${variantSelectors} {\n  background: var(--${
    t.name
  }-highlight) !important;\n  color: var(--${
    t.name
  }-text) !important;\n  border-radius: 4px;`;
  if (t.setGlow) {
    normal += `\n  --current-highlight-glow: var(--${t.name}-highlight);`;
  }
  normal += '\n}';

  // active state
  const activeSelectors = variantSelectors
    .split(/,\n/)
    .map((s) => `.animated-highlights-active ${s.trim()}`)
    .join(',\n');
  const active = `${activeSelectors} {\n  animation: ${t.animation};\n}`;

  blocks.push(normal, active);
}

// ------------------ Build menu item typography rule ------------------
const menuRule = `/* Enhanced font styling for all menu items */\n[role='menuitem'] div[style*='background:'] {\n  font-size: var(--menu-font-size) !important;\n  font-weight: var(--menu-font-weight) !important;\n}`;

// ------------------ Assemble final CSS ------------------
const cssOutput = [
  root.join('\n'),
  '\n\n/* --- Animations --- */\n\n',
  animations,
  '\n\n',
  blocks.join('\n\n'),
  '\n\n',
  menuRule,
  '\n',
].join('');

// ------------------ Write styles.css ------------------
const outPath = path.join(__dirname, 'styles.css');
fs.writeFileSync(outPath, cssOutput);
console.log('✅  styles.css has been generated.');
