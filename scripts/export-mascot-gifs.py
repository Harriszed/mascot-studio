"""Export every authored mascot state as a transparent, crisp 2x GIF.

Install the optional export dependency with:
    python -m pip install -r scripts/requirements-gifs.txt
"""
import bisect
import json
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
DESTINATION = ROOT / 'public' / 'mascot' / 'gifs'
SCALE = 2
TICK_MS = 20  # Browser-safe 50fps; GIF cannot represent the original 60Hz gait.


def source_states():
    script = """
        import { readFileSync } from 'node:fs';
        import { buildStates } from './scripts/mascot-pixel-art.mjs';
        const reference = JSON.parse(readFileSync('src/components/claude-mascot/reference-artwork.json'));
        console.log(JSON.stringify(buildStates(reference)));
    """
    return json.loads(subprocess.check_output(
        ['node', '--input-type=module', '-e', script], cwd=ROOT, text=True))


def pixel(value):
    return math.floor(value + .5)


def render_pose(state, shapes, colors, palette):
    vx, vy, width, height = state['viewBox']
    image = Image.new('P', (width, height), 0)
    image.putpalette(palette)
    pen = ImageDraw.Draw(image)
    for shape in shapes:
        color = colors[ImageColor.getrgb(shape['fill'])]
        if 'points' in shape:
            pen.polygon([(pixel(x-vx), pixel(y-vy)) for x, y in shape['points']], fill=color)
        else:
            left, top = pixel(shape['x']-vx), pixel(shape['y']-vy)
            right = pixel(shape['x']+shape['w']-vx)-1
            bottom = pixel(shape['y']+shape['h']-vy)-1
            if right >= left and bottom >= top:
                pen.rectangle((left, top, right, bottom), fill=color)
    return image.resize((width*SCALE, height*SCALE), Image.Resampling.NEAREST)


def export_state(state):
    values = sorted({ImageColor.getrgb(s['fill']) for f in state['frames'] for s in f['shapes']})
    if len(values) > 255:
        raise ValueError(f"{state['name']}: palette exceeds GIF's 255 opaque colors")
    colors = {color: index+1 for index, color in enumerate(values)}
    palette = [0, 0, 0] + [v for color in values for v in color]
    palette += [0] * (768-len(palette))
    times = [f['time'] for f in state['frames']]
    ticks = max(1, pixel(state['duration']*1000/TICK_MS))
    images, durations, cached = [], [], {}

    def append_pose(index, hold):
        if index not in cached:
            cached[index] = render_pose(state, state['frames'][index]['shapes'], colors, palette)
        image = cached[index]
        if images and image.tobytes() == images[-1].tobytes():
            durations[-1] += hold
        else:
            images.append(image)
            durations.append(hold)

    for tick in range(ticks):
        index = bisect.bisect_right(times, tick*TICK_MS/1000 + 1e-9)-1
        append_pose(max(0, index), TICK_MS)
    # The two Done states finish at t=5s. Include their terminal resting pose;
    # omitting the loop extension makes viewers hold that final pose indefinitely.
    terminal_hold = 0
    if not state['loop']:
        append_pose(len(state['frames'])-1, 100)
        terminal_hold = 100
    options = {'loop': 0} if state['loop'] else {}
    filename = state['name']+'.gif'
    images[0].save(DESTINATION / filename, save_all=True, append_images=images[1:],
                   duration=durations, transparency=0, background=0, disposal=2,
                   optimize=False, **options)
    with Image.open(DESTINATION / filename) as gif:
        frame_count = gif.n_frames
    return {'name': state['name'], 'title': state['title'], 'file': filename,
            'width': images[0].width, 'height': images[0].height,
            'loop': state['loop'], 'sourceDurationMs': pixel(state['duration']*1000),
            'durationMs': sum(durations), 'terminalHoldMs': terminal_hold,
            'frameCount': frame_count}


def main():
    states = source_states()
    DESTINATION.mkdir(parents=True, exist_ok=True)
    results = [export_state(state) for state in states]
    manifest = {'background': 'transparent', 'scale': SCALE, 'sampleRate': 50,
                'timing': '20ms sampling; cycle duration rounded to the nearest 20ms.',
                'states': results}
    (DESTINATION / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
    (DESTINATION / 'NOTICE.md').write_bytes((ROOT / 'NOTICE.md').read_bytes())
    guide = f"""# Mascot Studio / {len(states)} individual GIF animations

Each state has its own transparent GIF, named with the same identifier as its SVG.
Includes originals, accessories, extended activities, and all ten extended gags.
480 x 440 pixels, enlarged exactly 2x with nearest-neighbor pixels. No labels or backgrounds.
Colors are preserved without dithering. Timing is sampled at 50fps and rounded to 20ms;
this adapts the original 60Hz walking gait to browser-safe GIF timing.
Done and Done / extended play once, then remain in the resting pose. Other states loop.
GIF players control playback; interactive speed, pause and color controls belong to SVG/React.
See manifest.json for each file's timing and NOTICE.md for attribution and reuse status.

| Identifier | Animation |
| --- | --- |
"""
    guide += ''.join(f"| `{s['name']}` | {s['title']} |\n" for s in states)
    (DESTINATION / 'README.md').write_text(guide, encoding='utf-8')
    print(f'Exported {len(results)} transparent individual GIFs at {DESTINATION}')


if __name__ == '__main__':
    main()
