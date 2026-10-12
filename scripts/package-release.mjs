import { readFile, writeFile, readdir, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';

const root = fileURLToPath(new URL('../', import.meta.url));
const assets = path.join(root, 'public/mascot');
const release = path.join(root, 'release');
await mkdir(release, { recursive: true });
// Offer the existing sharing GIFs as standalone release downloads.
for (const name of ['mascot-showcase.gif', 'reddit-mascot-showcase.gif', 'fluid-showcase.gif', 'gag-showcase.gif']) {
  await copyFile(path.join(root, 'sharing', name), path.join(release, name));
}

// Standard ZIP writer: no platform-specific shell or runtime dependencies.
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
async function files(directory, prefix = '') {
  const result = [];
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
    if (entry.name === '__pycache__' || entry.name.endsWith('.pyc')) continue;
    const name = prefix + entry.name;
    if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), name + '/'));
    else if (entry.isFile()) result.push([name, path.join(directory, entry.name)]);
  }
  return result;
}
async function zip(destination, entries) {
  const parts = [], central = [];
  let offset = 0;
  for (const [name, filename] of entries) {
    const bytes = await readFile(filename), compressed = deflateRawSync(bytes), label = Buffer.from(name);
    const crc = crc32(bytes);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50); local.writeUInt16LE(20,4); local.writeUInt16LE(0x800,6);
    local.writeUInt16LE(8,8); local.writeUInt16LE(33,12); local.writeUInt32LE(crc,14);
    local.writeUInt32LE(compressed.length,18); local.writeUInt32LE(bytes.length,22); local.writeUInt16LE(label.length,26);
    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50); record.writeUInt16LE(20,4); record.writeUInt16LE(20,6);
    record.writeUInt16LE(0x800,8); record.writeUInt16LE(8,10); record.writeUInt16LE(33,14);
    record.writeUInt32LE(crc,16); record.writeUInt32LE(compressed.length,20); record.writeUInt32LE(bytes.length,24);
    record.writeUInt16LE(label.length,28); record.writeUInt32LE(offset,42);
    parts.push(local,label,compressed); central.push(record,label);
    offset += local.length + label.length + compressed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length,8); end.writeUInt16LE(entries.length,10);
  end.writeUInt32LE(directory.length,12); end.writeUInt32LE(offset,16);
  await writeFile(destination, Buffer.concat([...parts,directory,end]));
  console.log(`Packaged ${path.relative(root,destination)} (${entries.length} files)`);
}
await copyFile(path.join(root,'NOTICE.md'),path.join(assets,'NOTICE.md'));
const gifNames = new Set(JSON.parse(await readFile(path.join(assets,'gifs/manifest.json'),'utf8')).states.map(s => s.file));
const gifEntries = (await files(path.join(assets,'gifs'))).filter(([name]) => gifNames.has(name) || ['manifest.json','README.md','NOTICE.md'].includes(name));
if (gifEntries.filter(([name]) => name.endsWith('.gif')).length !== gifNames.size) throw new Error('GIF exports are incomplete; run npm run export:gifs');
await zip(path.join(release,'mascot-gifs.zip'),gifEntries);
await copyFile(path.join(release,'mascot-gifs.zip'),path.join(assets,'claude-mascot-gif-pack.zip'));
const assetEntries = (await files(assets)).filter(([name]) =>
  !name.includes('/') && /\.(svg|json|md|html)$/.test(name) || name.startsWith('reference/'));
assetEntries.push(...gifEntries.map(([name,filename]) => ['gifs/'+name,filename]));
await zip(path.join(release,'mascot-assets.zip'),assetEntries);
await copyFile(path.join(release,'mascot-assets.zip'),path.join(assets,'claude-mascot-svg-pack.zip'));
const skillEntries = (await files(path.join(root,'skills/mascot-studio'),'mascot-studio/'));
skillEntries.push(['NOTICE.md',path.join(root,'NOTICE.md')]);
await zip(path.join(release,'mascot-studio.zip'),skillEntries);
const sourceEntries = [];
for (const folder of ['scripts','skills','src','sharing','.github']) sourceEntries.push(...await files(path.join(root,folder),folder+'/'));
sourceEntries.push(...assetEntries.map(([name,filename]) => ['public/mascot/'+name,filename]));
sourceEntries.push(['public/mascot/claude-mascot-svg-pack.zip',path.join(assets,'claude-mascot-svg-pack.zip')]);
for (const name of ['README.md','NOTICE.md','package.json','.gitignore']) sourceEntries.push([name,path.join(root,name)]);
await zip(path.join(release,'mascot-studio-source.zip'),sourceEntries);
