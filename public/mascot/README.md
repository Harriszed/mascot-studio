# Claude pixel mascot / 62 animations

This pack contains one transparent animated SVG for each requested state, plus four source-reference exports for comparison. The resting character uses the website's actual gym sprite at its original proportions. The activity poses use explicit blocks and discrete frame changes; they do not rotate or skew the character into smooth vector silhouettes.

Open `index.html`, or run `npm run dev` from the `Claude Mascot` project folder and visit `http://127.0.0.1:3000/mascot/index.html`. The preview server needs only Node.js; no dependencies need installing. Pause, replay, change speed, compare canvas backgrounds, and download each state. Canvas backgrounds are never embedded in an exported SVG.

## State mapping

| # | State value | Meaning |
| --- | --- | --- |
| 1 | `idle` | Waiting for you. |
| 2 | `thinking` | Working out an answer; no tool running. |
| 3 | `using-tool` | Doing work; one animation for every tool. |
| 4 | `directing-helpers` | Helper agents are running. |
| 5 | `done` | Just finished; shown for five seconds. |
| 6 | `greeting` | A new chat has opened. |
| 7 | `asleep` | Idle for a long time; cache has gone cold. |
| 8 | `reading` | Opening and reading files. |
| 9 | `writing` | Changing files. |
| 10 | `running-commands` | Installs, builds, and terminal commands. |
| 11 | `searching-web` | Web searches and fetching pages. |
| 12 | `searching-code` | Looking through code. |
| 13 | `testing` | Running tests. |
| 14 | `committing` | Committing or pushing to git. |
| 15 | `waiting-for-you` | Needs approval or an answer. |
| 16 | `error` | A command or tool failed. |
| 17 | `compacting` | Tidying up chat memory. |
| 18 | `context-nearly-full` | Context usage is over 80%. |
| 19 | `plan-progress` | Ticking off the to-do list. |
| 20 | `server-running` | A dev server or Expo is running. |
| 21 | `typing` | You have started writing a message. |
| 22 | `walking` | A continuous walk cycle, looping in place. |

Your app supplies these activity signals. The assets and component do not infer tool activity, agent activity, cold-cache status, context usage, or whether a server is running. The animations are visual status cues; moving meters and checklists are stylized activity indicators, not measured progress values.

## Plain SVG

```html
<img src="/mascot/reading.svg" width="240" height="220" alt="Reading files" />
```

Change `src` when the activity changes. Every activity SVG uses the same `-20 -40 240 220` viewBox, coral `#DD775B`, and transparent canvas. They contain vector blocks and embedded CSS, with no JavaScript, raster images, fonts, GSAP dependency, or remote requests. Native image views that rasterize SVGs may drop CSS animation; use a browser or web view for these assets.

Most states loop. `done.svg` runs once for five seconds and then holds the resting pose. All files respect `prefers-reduced-motion` and show a static pose when motion is reduced.

## React / Next.js

Copy `src/components/claude-mascot/ClaudeMascot.tsx` and its neighbouring `artwork.json` from the project root into your React app. For example, after copying them into `src/components/claude-mascot/`:

```tsx
import ClaudeMascot, { MASCOT_STATES } from '@/components/claude-mascot/ClaudeMascot';
import type { MascotState } from '@/components/claude-mascot/ClaudeMascot';

<ClaudeMascot state="reading" size={180} />
<ClaudeMascot state="using-tool" speed={0.8} />
<ClaudeMascot state="done" onDoneComplete={() => setActivity('idle')} />
<ClaudeMascot state="idle" decorative />
<ClaudeMascot state="walking" size={160} />
```

`MascotState` includes the 22 base values above and the accessory variants below. `MASCOT_STATES` exposes their names, titles, and descriptions for selectors. Changing state restarts its pose sequence.

`done` automatically returns to idle after five seconds of wall-clock time and calls `onDoneComplete` once. Switching away cancels the timer. Remount the component with a new React `key` if a second completion should replay while its input is still `done`. The five-second status window also applies with reduced motion, changed playback speed, or paused animation.

Options: `size`, `color`, `eyeColor` (also used by black prop details), `speed` (positive multiplier), `paused`, `loop`, `label`, and `decorative`. Ordinary SVG props, `className`, and `style` are forwarded. `loop={false}` holds the last pose. Keep status text or a live region in the surrounding app if activity changes should be announced.

## Walking across a screen

`walking.svg` and `state="walking"` contain only the steady walking gait from the original clip: a seamless 0.2-second, 12-frame cycle sampled at 60Hz. The source's horizontal travel is removed, and the torso stays at the shared character position. This state has no opening look-around, crouch, jump, or ending. Use `speed={0.5}` in React to slow the gait to a 0.4-second cycle.

Move an outer wrapper to control distance and travel speed independently. This example crosses any container in eight seconds; the reset happens outside its edges. Add `data-direction="left"` to the lane to reverse the travel and mirror the character. Change `--travel-duration` to adjust the crossing time.

```html
<div class="walking-lane" data-direction="right" style="--travel-duration: 8s">
  <div class="walker">
    <img class="walking-sprite" src="/mascot/walking.svg"
         width="160" height="160" alt="Walking" />
  </div>
</div>
```

```css
.walking-lane { position: relative; height: 160px; overflow: hidden; }
.walker {
  position: absolute; top: 0; left: 0; width: 100%;
  animation: walk-right var(--travel-duration, 8s) linear infinite;
}
.walking-sprite { display: block; width: 160px; height: 160px; }
.walking-lane[data-direction="left"] .walker { animation-name: walk-left; }
.walking-lane[data-direction="left"] .walking-sprite { transform: scaleX(-1); }
@keyframes walk-right {
  from { transform: translateX(-160px); }
  to { transform: translateX(100%); }
}
@keyframes walk-left {
  from { transform: translateX(100%); }
  to { transform: translateX(-160px); }
}
@media (prefers-reduced-motion: reduce) {
  .walker { animation: none; transform: none; }
}
```

In React, replace the image with `<ClaudeMascot state="walking" className="walking-sprite" size={160} paused={paused} />`. Pause the wrapper's `animation-play-state` as well to stop screen travel. CSS variables cannot pass through an external `<img>` into its SVG document. The preview's walking lane demonstrates both travel directions and independent crossing times.

## Source-reference exports

`reference/` contains `gym.svg`, `confetti.svg`, `flag.svg`, and `walking.svg`. Their geometry is measured from the public SVG demo and their frame holds follow its actual timelines. The flag preserves its raising sequence before the continuous wave. The original walking animation uses continuous GSAP tweens; its transparent SVG export samples that motion at **60 frames per second**. The sprite animations preserve their measured discrete poses and holds. Extra canvas margins preserve pixels that extend outside the original SVG viewBoxes.

These reference exports are retained to compare the character with the site. The activity scenes are adaptations: reading, searching, typing, memory, and the other requested activities do not exist in the original four clips. The tool state uses the source gym sequence, Done uses its celebration poses, and Walking extracts the steady gait from the source walking clip.

Reference artwork and original animation: [Ayotomiwa Wale-Durojaye's demo](https://ayotomcs.me/claude-mascot), described in [the Codrops article](https://tympanus.net/codrops/2026/05/05/reverse-engineering-claude-ais-mascot-animations-with-svg-and-gsap/). Claude's character belongs to Anthropic; this is not an official Anthropic asset pack.

## Regeneration

`src/components/claude-mascot/reference-artwork.json` stores the measured reference shapes and timings. `scripts/mascot-pixel-art.mjs` builds the base and accessory pose sequences and compiles their CSS. From the project root, run:

```sh
npm run build
npm run pack:assets
```

Rebuild the ZIP after exports change. The downloadable pack contains all base and accessory SVGs, all four reference SVGs, their manifests, and this guide. The previous smooth-vector attempts are preserved in `previous-version/` and excluded from the pack.

## Reuse status

See [NOTICE.md](NOTICE.md). Artwork redistribution permission remains unverified; no blanket commercial or open-source artwork license is granted.

## Extended pixel animations

All 22 activities have an extended pixel variant, using the original actor and drawing helpers. Append `-fluid` to any base state identifier, for example `using-tool-fluid`, `done-fluid`, or `searching-web-fluid`. Use the identifier in the React `state` prop or load its matching SVG. The manifest records `collection: "fluid"`, the base activity, and `style: "original-block-pixel"`. `done-fluid` plays once for five seconds and React returns it to `idle-fluid`; its callback follows the same five-second contract as `done`. Other extended states loop. `walking-fluid` has a 0.8-second gait, with wrapper travel controlled separately.

Open `fluid.html` for the original/fluid comparison, slow playback, pause, replay, and dark backgrounds. All 62 animations are in `index.html` and the asset ZIP.

## Accessory variant mapping

The eight variants preserve their base activity, duration, and loop behavior. `baseState` and `accessory` are recorded in the manifest. All original states remain available.

| Identifier | Base activity | Accessory |
| --- | --- | --- |
| `idle-wizard-hat` | `idle` | wizard hat |
| `thinking-wizard-hat` | `thinking` | wizard hat |
| `reading-wizard-hat` | `reading` | wizard hat |
| `writing-sunglasses` | `writing` | black sunglasses |
| `running-commands-sunglasses` | `running-commands` | black sunglasses |
| `greeting-crown` | `greeting` | crown |
| `asleep-nightcap` | `asleep` | nightcap |
| `error-propeller-cap` | `error` | propeller cap |

Use variants like any other state: `<ClaudeMascot state="thinking-wizard-hat" />`.

## Extended gag states

Open `gags.html` for all ten new stories. Speech-bubble captions are supplied by the host app.

| Identifier | Visual sequence |
| --- | --- |
| `gag-hallucinate` | Looks up, sketches an imaginary rainbow constellation, double-checks it with a ruler and confidently signs it off. (11.97s loop.) |
| `gag-tokens` | Counts six coins into a jar, tries to fit the overflow, catches the surplus and packs the savings away. (13.58s loop.) |
| `gag-context` | Fills the memory bar, puffs up while trying one extra card, presses a release valve and slowly returns to size. (12.20s loop.) |
| `gag-prompt` | Draws a quiet problem in the air, considers two routes, scratches its head and assembles one steady three-step answer. (12.41s loop.) |
| `gag-robot` | Welcomes a tiny robot, exchanges a wave and a real fist bump, shares a little victory groove and sees it off. (11.74s loop.) |
| `gag-nap` | Puts on a nightcap, dozes through training, wakes for a stretch, nearly falls asleep again and finally catches itself. (13.26s loop.) |
| `gag-coffee` | Grinds a few beans, pours into a tabletop mug, stirs and taps the spoon, then quietly savors the warmth. (13.38s loop.) |
| `gag-dance` | Puts on headphones, finds the beat, side-steps, poses, adds a small hop and bows before taking them off. (10.19s loop.) |
| `gag-buffering` | Watches the spinner stall, winds a little crank to restart it, celebrates success and spots a new stall. (10.51s loop.) |
| `gag-deploy` | Inspects a rocket, pulls a launch lever, counts down, watches the accelerating launch and verifies delivery before resetting the pad. (10.56s loop.) |

Use `<ClaudeMascot state="gag-robot" />` or load `gag-robot.svg`. These states use `collection: "gags"`, `extended: true`, and `style: "original-block-pixel"` metadata. All ten loop, pause, honor speed controls, and show a static readable pose with reduced motion.

## Individual GIF downloads

Open `index.html` and select a state to download its transparent GIF. Each file is in `gifs/<state-id>.gif`; all 62 are available in `claude-mascot-gif-pack.zip` on the live site or the `mascot-gifs.zip` release download. The asset pack includes the GIF folder for offline use. GIFs are 480 x 440, use crisp 2x scaling and no captions or background. GIF timing is sampled at 50fps (20ms steps). Done states play once and hold their resting pose; the other states loop. See `gifs/manifest.json` for timings.

## Refined animation stories

The extended activities use separate setup, action and recovery holds, planted feet for small torso movements, and steady status indicators. The ten gag loops now run roughly 10-14 seconds with additional actions and payoffs. Done remains a five-second one-shot. The original 22 states and eight accessories retain their existing behavior.


The v1.7 stories use preparation, deliberate work, payoff and recovery. `directing-helpers-fluid` wears shades and dispatches floating task cards; it has no miniature helpers. `using-tool-fluid` is the approved hammering story. The original 30 assets remain unchanged.
