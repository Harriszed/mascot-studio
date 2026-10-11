"""Render the authored pixel frames directly to a portable, lossless GIF.

Requires Pillow (only for this optional sharing export); Node builds need no deps.
"""
import json
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
source = "import {readFileSync} from 'node:fs'; import {buildStates} from './scripts/mascot-pixel-art.mjs'; console.log(JSON.stringify(buildStates(JSON.parse(readFileSync('src/components/claude-mascot/reference-artwork.json'))).filter(s=>s.collection==='fluid')));"
gag_mode = '--gags' in sys.argv
if gag_mode:
    source = source.replace("s.collection==='fluid'", "s.collection==='gags'")
states = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', source], cwd=ROOT, text=True))

def font(size):
    for name in ['C:/Windows/Fonts/segoeui.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/System/Library/Fonts/Supplemental/Arial.ttf']:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()

page_size = 6 if gag_mode else 8
page_seconds = 8 if gag_mode else 6
page_count = (len(states) + page_size - 1) // page_size
frames = []
for index in range(page_count * page_seconds * 20):
    time = index / 20
    group = min(page_count - 1, int(time // page_seconds))
    image = Image.new('RGB', (960, 720), '#F7F4EC')
    draw = ImageDraw.Draw(image)
    draw.text((32, 24), 'MASCOT STUDIO / EXTENDED PIXEL GAGS' if gag_mode else 'MASCOT STUDIO / EXTENDED PIXEL COLLECTION', font=font(15), fill='#9D452F')
    draw.text((32, 57), 'A few questionable habits.' if gag_mode else 'Same pixels. More personality.', font=font(42), fill='#25231E')
    draw.text((34, 116), f'{len(states)} visual jokes. Original block style. Bring your own speech bubbles.' if gag_mode else '22 activities. Original block artwork. New key poses and stories.', font=font(17), fill='#70685D')
    for number, state in enumerate(states[group * page_size:group * page_size + page_size]):
        columns = 3 if gag_mode else 4
        left, top = 32 + (number % columns) * (300 if gag_mode else 228), 164 + (number // columns) * 250
        draw.rectangle((left, top, left + (284 if gag_mode else 212), top + 212), fill='#EDE9DF')
        local_time = time % page_seconds
        playback = local_time % state['duration'] if state['loop'] else min(local_time, state['duration'])
        pose = next(f for f in reversed(state['frames']) if f['time'] <= playback)
        # Draw at native resolution, then enlarge only with nearest-neighbor.
        tile = Image.new('RGBA', (240, 220))
        pen = ImageDraw.Draw(tile)
        for shape in pose['shapes']:
            x, y = shape['x'] + 20, shape['y'] + 40
            pen.rectangle((x, y, x + shape['w'] - 1, y + shape['h'] - 1), fill=shape['fill'])
        # Native 1x pixels; crop empty horizontal margins to fit the card.
        tile = tile.crop((14, 4, 226, 216))
        image.paste(tile, (left + (36 if gag_mode else 0), top), tile)
        draw.text((left, top + 221), state['title'].split(' / extended')[0], font=font(15), fill='#25231E')
    draw.line((32, 670, 928, 670), fill='#CEC8BA')
    draw.text((32, 683), f'mascot-studio / {len(states)} extended gags / Transparent SVGs' if gag_mode else 'mascot-studio / Originals and extended pixel variants included', font=font(14), fill='#70685D')
    frames.append(image)

out = ROOT / 'sharing'
out.mkdir(exist_ok=True)
prefix = 'gag-showcase' if gag_mode else 'fluid-showcase'
frames[190 if gag_mode else 30].save(out / (prefix + '.png'))
palette_source = Image.new('RGB', (960, 720 * 4))
for i, frame in enumerate([frames[0], frames[30], frames[len(frames)//2+30], frames[-45]]):
    palette_source.paste(frame, (0, i * 720))
palette = palette_source.quantize(colors=96)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
indexed[0].save(out / (prefix + '.gif'), save_all=True, append_images=indexed[1:], duration=50, loop=0, optimize=True, disposal=1)
print('Rendered pixel showcase:', out / (prefix + '.gif'))
