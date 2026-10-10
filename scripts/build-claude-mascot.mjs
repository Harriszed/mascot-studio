import { readFile, writeFile, mkdir, readdir, copyFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildStates, compileAnimation, svgDocument } from './mascot-pixel-art.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDirectory = path.join(root, 'src/components/claude-mascot');
const destination = path.join(root, 'public/mascot');
const reference = JSON.parse(await readFile(path.join(sourceDirectory, 'reference-artwork.json'), 'utf8'));
const animations = buildStates(reference).map(compileAnimation);
await mkdir(destination, { recursive: true });
// Preserve the previous attempt without mixing it into the new activity pack.
const oldStates = ['idle-curious', 'idle-sway', 'idle-stretch', 'loading', 'listening', 'speaking', 'success', 'sleeping', 'waving'];
const existing = await readdir(destination);
for (const name of oldStates) {
  if (existing.includes(`${name}.svg`)) {
    const archive = path.join(destination, 'previous-version');
    await mkdir(archive, { recursive: true });
    await copyFile(path.join(destination, `${name}.svg`), path.join(archive, `${name}.svg`));
    await unlink(path.join(destination, `${name}.svg`));
  }
}
for (const animation of animations) await writeFile(path.join(destination, `${animation.name}.svg`), svgDocument(animation));
const metadata = animations.map(({ css, markup, ...item }) => ({ ...item, file: `${item.name}.svg` }));
await writeFile(path.join(destination, 'manifest.json'), JSON.stringify({
  version: 2, background: 'transparent', viewBox: '-20 -40 240 220', color: '#DD775B',
  source: reference.source, doneDisplayMs: 5000, states: metadata,
}, null, 2) + '\n');
await writeFile(path.join(sourceDirectory, 'artwork.json'), JSON.stringify({ states: animations }) + '\n');
const referenceDirectory = path.join(destination, 'reference');
await mkdir(referenceDirectory, { recursive: true });
const references = [];
for (const [name, art] of Object.entries(reference.animations)) {
  const viewBox = name === 'gym' ? [-20, -5, 180, 140] : name === 'confetti' ? [-45, -85, 225, 205] : art.viewBox;
  const animation = compileAnimation({ name: `reference-${name}`, label: `Reference ${name}`, title: name, description: 'Measured poses from the original demo.', viewBox, duration: art.duration, frames: art.frames, loop: true });
  if (name === 'flag') {
    const intro = compileAnimation({ name: 'reference-flag-intro', label: 'Flag raising', viewBox, duration: art.introDuration, frames: art.intro, loop: false });
    animation.markup = `<g class="cm-intro">${intro.markup}</g><g class="cm-loop">${animation.markup}</g>`;
    const selector = '.cm-root[data-state="reference-flag"]';
    animation.css = animation.css.replaceAll(selector, `${selector} .cm-loop`)
      + intro.css.replaceAll('.cm-root[data-state="reference-flag-intro"]', `${selector} .cm-intro`)
      + `${selector} .cm-loop .cm-frame { animation-delay: ${art.introDuration}s; }\n`
      + `${selector} .cm-intro { animation: cm-flag-intro-hide ${art.introDuration}s steps(1, end) 1 both; }\n`
      + `${selector} .cm-loop { animation: cm-flag-loop-show ${art.introDuration}s steps(1, end) 1 both; }\n`
      + '@keyframes cm-flag-intro-hide { 0% { opacity: 1; } 100% { opacity: 0; } }\n'
      + '@keyframes cm-flag-loop-show { 0% { opacity: 0; } 100% { opacity: 1; } }\n'
      + `@media (prefers-reduced-motion: reduce) { ${selector} .cm-intro { display: none; animation: none !important; } ${selector} .cm-loop { animation: none !important; opacity: 1; } }\n`;
  }
  await writeFile(path.join(referenceDirectory, `${name}.svg`), svgDocument(animation));
  references.push({ name, file: `reference/${name}.svg`, duration: art.duration, viewBox, poseCount: animation.poseCount });
}
await writeFile(path.join(referenceDirectory, 'manifest.json'), JSON.stringify({ source: reference.source, references, walkingSampleRate: 60, flagExport: 'Original raising sequence followed by the raised flag loop.' }, null, 2) + '\n');
console.log(`Built ${animations.length} pixel activity animations and ${references.length} reference animations.`);
