// build-styles.js
// Script to generate styles.css from a central colour definition table
// Run: `node build-styles.js`

const fs = require('fs');
const path = require('path');

/**
 * Theme definition table – keeps highlight colour, text colour, the list of
 * inline-style colour variants we need to match, and the animation used when
 * the `.animated-highlights-active` class is present.
 */
const themes = [
  {
    name: 'gray',
    highlight: '#dcdcdc',
    text: 'black',
    variants: [
      'rgba(240, 239, 237, 1)',
      'rgb(240, 239, 237)',
      'rgba(47, 47, 47, 1)',
      'rgb(47, 47, 47)',
      'rgba(84, 72, 49, 0.15)',
      'rgba(255, 255, 255, 0.13)',
      'rgba(42, 28, 0, 0.07)',
      'rgba(255, 255, 235, 0.1)',
    ],
    animation: 'subtlePulse 2s infinite ease-in-out',
    setGlow: false,
  },
  {
    name: 'brown',
    highlight: '#986a33',
    text: 'white',
    variants: [
      'rgba(245, 237, 233, 1)',
      'rgb(245, 237, 233)',
      'rgba(74, 50, 40, 1)',
      'rgb(74, 50, 40)',
      'rgba(210, 162, 141, 0.35)',
      'rgba(184, 101, 67, 0.45)',
      'rgba(139, 46, 0, 0.086)',
      'rgba(255, 177, 129, 0.191)',
    ],
    animation: 'colorCycle 3s infinite linear',
    setGlow: false,
  },
  {
    name: 'orange',
    highlight: '#ff9351',
    text: 'white',
    variants: [
      'rgba(251, 235, 222, 1)',
      'rgb(251, 235, 222)',
      'rgba(92, 59, 35, 1)',
      'rgb(92, 59, 35)',
      'rgba(224, 124, 57, 0.27)',
      'rgba(233, 126, 35, 0.45)',
      'rgba(224, 101, 1, 0.129)',
      'rgba(255, 147, 75, 0.278)',
    ],
    animation: 'gentleGlow 2.2s infinite alternate',
    setGlow: true,
  },
  {
    name: 'yellow',
    highlight: '#faff72',
    text: 'black',
    variants: [
      'rgba(249, 243, 220, 1)',
      'rgb(249, 243, 220)',
      'rgba(86, 67, 40, 1)',
      'rgb(86, 67, 40)',
      'rgba(236, 191, 66, 0.39)',
      'rgba(250, 177, 67, 0.5)',
      'rgba(211, 168, 0, 0.137)',
      'rgba(255, 216, 112, 0.23)',
    ],
    animation: 'subtlePulse 2.5s infinite ease-in-out',
    setGlow: false,
  },
  {
    name: 'green',
    highlight: '#74de2e',
    text: 'black',
    variants: [
      'rgba(232, 241, 236, 1)',
      'rgb(232, 241, 236)',
      'rgba(36, 61, 48, 1)',
      'rgb(36, 61, 48)',
      'rgba(123, 183, 129, 0.27)',
      'rgba(45, 153, 100, 0.5)',
      'rgba(0, 100, 45, 0.09)',
      'rgba(108, 255, 172, 0.156)',
    ],
    animation: 'colorCycle 3.5s infinite linear',
    setGlow: false,
  },
  {
    name: 'blue',
    highlight: '#3da5ff',
    text: 'white',
    variants: [
      'rgba(232, 242, 250, 1)',
      'rgb(232, 242, 250)',
      'rgba(20, 58, 78, 1)',
      'rgb(20, 58, 78)',
      'rgba(93, 165, 206, 0.27)',
      'rgba(51, 126, 169, 0.5)',
      'rgba(0, 111, 200, 0.09)',
      'rgba(67, 155, 255, 0.239)',
    ],
    animation: 'gentleGlow 2.5s infinite alternate',
    setGlow: true,
  },
  {
    name: 'purple',
    highlight: '#bf51e2',
    text: 'white',
    variants: [
      'rgba(243, 235, 249, 1)',
      'rgb(243, 235, 249)',
      'rgba(60, 45, 73, 1)',
      'rgb(60, 45, 73)',
      'rgba(168, 129, 197, 0.27)',
      'rgba(168, 91, 242, 0.34)',
      'rgba(102, 0, 178, 0.078)',
      'rgba(200, 125, 255, 0.2)',
    ],
    animation: 'subtlePulse 1.8s infinite ease-in-out',
    setGlow: false,
  },
  {
    name: 'pink',
    highlight: '#ff74bc',
    text: 'white',
    variants: [
      'rgba(250, 233, 241, 1)',
      'rgb(250, 233, 241)',
      'rgba(78, 44, 60, 1)',
      'rgb(78, 44, 60)',
      'rgba(225, 136, 179, 0.27)',
      'rgba(220, 76, 145, 0.4)',
      'rgba(197, 0, 93, 0.086)',
      'rgba(255, 103, 177, 0.23)',
    ],
    animation: 'gentleGlow 2.8s infinite alternate',
    setGlow: true,
  },
  {
    name: 'red',
    highlight: '#ff3737',
    text: 'white',
    variants: [
      'rgba(252, 233, 231, 1)',
      'rgb(252, 233, 231)',
      'rgba(82, 46, 42, 1)',
      'rgb(82, 46, 42)',
      'rgba(244, 171, 159, 0.4)',
      'rgba(222, 85, 83, 0.45)',
      'rgba(223, 22, 0, 0.094)',
      'rgba(255, 104, 92, 0.239)',
    ],
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
  const variantSelectors = t.variants
    .flatMap((v) => {
      // Ensure we preserve the exact spacing that might appear after "background:".
      // 1. Always include selector exactly as given in the variants array (may already start with a space).
      // 2. If the variant does NOT start with a space, also add a version WITH the leading space so both forms are matched.
      const selectors = [`*:not(nav):not(nav *)[style*='background:${v}']`];
      if (!v.startsWith(' ')) {
        selectors.push(`*:not(nav):not(nav *)[style*='background: ${v}']`);
      }
      return selectors;
    })
    .join(',\n');

  // normal state
  let normal = `/* ${cap(
    t.name,
  )} theme */\n${variantSelectors} {\n  background: var(--${
    t.name
  }-highlight) !important;\n  color: var(--${t.name}-text) !important;`;
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
