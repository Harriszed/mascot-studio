import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const supplied = process.argv[2];
if (!supplied || supplied === '--help') {
  console.log('Usage: node inspect-source.mjs "<mascot project or source folder>"');
  process.exitCode = supplied === '--help' ? 0 : 1;
} else {
  try {
    const input = path.resolve(supplied);
    if (!(await stat(input)).isDirectory()) throw new Error('Supply a directory, not a file.');
    const exists = async filename => {
      try { await access(filename); return true; }
      catch (error) {
        if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false;
        throw error;
      }
    };
    const source = 'src/components/claude-mascot';
    let root = input;
    while (!await exists(path.join(root, 'scripts/mascot-pixel-art.mjs'))
      || !await exists(path.join(root, source, 'reference-artwork.json'))) {
      const parent = path.dirname(root);
      if (parent === root) throw new Error('No Claude Mascot pixel project found at this folder or its ancestors. Inspect other layouts directly.');
      root = parent;
    }
    const optionalJson = async relative => await exists(path.join(root, relative))
      ? JSON.parse(await readFile(path.join(root, relative), 'utf8')) : null;
    const manifest = await optionalJson('public/mascot/manifest.json');
    const reference = await optionalJson('public/mascot/reference/manifest.json');
    const artwork = await optionalJson(`${source}/artwork.json`);
    const project = await optionalJson('package.json');
    const paths = {
      generator: 'scripts/mascot-pixel-art.mjs',
      referenceArtwork: `${source}/reference-artwork.json`,
      reactComponent: `${source}/ClaudeMascot.tsx`,
      generatedArtwork: `${source}/artwork.json`,
      exportBuilder: 'scripts/build-claude-mascot.mjs',
      previewBuilder: 'scripts/build-mascot-preview.mjs',
      packager: 'scripts/package-release.mjs',
      preview: 'public/mascot/index.html',
      guide: 'public/mascot/README.md',
    };
    const files = {};
    for (const [name, relative] of Object.entries(paths)) {
      files[name] = { path: path.join(root, relative), exists: await exists(path.join(root, relative)) };
    }
    const states = manifest?.states ?? artwork?.states ?? [];
    if (!Array.isArray(states)) throw new Error('The current state registry must be an array.');
    const names = states.map(state => state.name);
    if (new Set(names).size !== names.length || names.some(name => typeof name !== 'string' || !name)) {
      throw new Error('State identifiers are missing or duplicated.');
    }
    console.log(JSON.stringify({
      suppliedFolder: input,
      projectRoot: root,
      files,
      style: { color: manifest?.color, viewBox: manifest?.viewBox, background: manifest?.background },
      stateCount: states.length,
      states: states.map(({ name, title, duration, loop }) => ({ name, title, duration, loop })),
      referenceCount: reference?.references?.length ?? 0,
      commands: project?.scripts ?? {},
      writesPerformed: false,
    }, null, 2));
  } catch (error) {
    console.error(`Cannot inspect mascot source: ${error.message}`);
    process.exitCode = 1;
  }
}
