# Existing Claude Mascot pipeline

These details describe the supplied code layout. Check the current files before applying them; do not assume another mascot project uses these coordinates or behaviors.

## Source and generated files

| Path | Role |
| --- | --- |
| `scripts/mascot-pixel-art.mjs` | Editable state registry, drawing helpers, pose builders, SVG/CSS compiler. |
| `scripts/mascot-fluid-art.mjs` | Original block actor helpers and weighted storyboards for all 22 extended pixel activities. |
| `scripts/mascot-extended-activities.mjs` | Additional original-style tool, search, completion, and status storyboards. |
| `scripts/mascot-gag-art.mjs` | Ten extended gag storyboards using the original actor; speech captions stay in the host. |
| `scripts/build-gag-preview.mjs` | Dedicated ten-gag gallery, canvas controls, and downloads. |
| `scripts/build-fluid-preview.mjs` | Original/fluid comparison with slow playback and canvas controls. |
| `src/components/claude-mascot/reference-artwork.json` | Measured source frames, timings, and original geometry. Retain for comparison. |
| `src/components/claude-mascot/ClaudeMascot.tsx` | React API, supported `MascotState` union, runtime playback, and done-to-idle timer. |
| `scripts/build-claude-mascot.mjs` | Compiles states and original reference exports. |
| `scripts/build-mascot-preview.mjs` | Generates activity selectors, gallery, downloads, and walking lane. |
| `scripts/export-mascot-gifs.py` | Transparent individual 2x GIF exports from authored states; requires the pinned Pillow dependency. |
| `scripts/package-release.mjs` | Packages state SVGs, reference exports, manifests, guide, and preview. |
| `src/components/claude-mascot/artwork.json` | Generated CSS/markup used by React and the preview generator. |
| `public/mascot/` | Generated SVGs, manifests, preview, and ZIP; README is maintained manually. |
| `output/playwright/` | Captures and browser checks from earlier iterations. Some assume old counts or geometry. |

The generator and React component can run without downloading or remeasuring the original website. Do not copy generated bundle code from `output/playwright/reference-chunks/` into the mascot runtime.

## Pose representation and appearance

`stateDefinitions` contains `[id, title, description, durationSeconds]`. `buildStates(reference)` supplies frames for each state and metadata including `number`, `name`, `title`, `label`, `description`, `duration`, `loop`, and `viewBox`.

Frames have `{ time, shapes }`. Shapes are rectangles `{ x, y, w, h, fill }` or polygons `{ points: [[x, y], ...], fill }`. `compileAnimation` deduplicates identical poses and produces CSS frame holds using `steps(1, end)`. `svgDocument` emits transparent standalone SVGs. Keep frame times ordered and within the state's duration, including a deliberate terminal pose for a one-shot state.

The shared activity viewBox is currently `[-20, -40, 240, 220]`. The resting torso is at `(55, 70)` with size `85 Ã— 65`; eyes begin at `(65, 81)` and `(119, 81)`, each `11 Ã— 11`. The head is the upper region of the body rather than a separate shape. `actor(reference, options)` moves and changes that pose with `dx`, `dy`, gaze, stepped lean, eyes, and arm choices. Reference-derived poses can have different geometry: anchor accessories to each pose's actual body or limb data rather than adding a fixed canvas overlay.

The current character is coral `#DD775B` with black eyes. Body and black detail colors compile to `--cm-color` and `--cm-ink`. Other accent colors are literal unless deliberately parameterized. Use explicit blocks, crisp edges, and discrete pose changes for pixel variants. An accessory should follow movement without detaching, hiding the face accidentally, or smoothing the pixel silhouette into rotated vectors.

## Adding activities or variants

For a new activity, add its registry entry and builder, then extend `MascotState` in the React component. The generated gallery and manifest iterate over the compiled states, so most additions flow through the existing build. Give states unique identifiers safe for filenames and CSS selectors. Update the integration guide when adding supported states.

For an accessory shared across activities, compose it with base frames using a reusable helper and per-frame attachment anchors. Add stable named variants to the compiled collection so downloads, manifest entries, and preview selection agree. Preserve base frame times and loop behavior. If variants are kept in a separate collection instead, wire that collection into the generator, preview, component, and ZIP; exporting an isolated SVG is not a complete variant workflow.

The current builder and component handle `done` and `done-fluid`. A `done` accessory variant therefore needs explicit completion runtime handling, or another deliberate API that retains the five-second done-to-idle contract. Copying it under a new name without updating that behavior is insufficient. `loop` should be inherited from the base state rather than inferred solely from the new variant's name.

## Behaviors to preserve when extending the base collection

- `done`: five-second status window, standalone resting terminal pose, React callback exactly once, and timer cancelled on unmount/state change. Its wall-clock status window does not change with animation speed, pause, or reduced motion.
- `walking`: currently twelve 60 Hz source samples forming a 0.2-second gait in place. Original stage translation is removed; screen travel belongs to the outer walking-lane wrapper. Accessories inherit its timing and keep the torso stationary unless the user requests a different gait.
- CSS playback: `--cm-tempo`, `--cm-repeat`, and `data-paused` remain effective. Reduced motion leaves one readable static pose.
- Exports: transparent canvas; checkerboard and other preview backgrounds are not baked into files. Expand the canvas deliberately if an accessory needs additional space and check every affected pose.

## Validation traps

`public/mascot/__check/poses.json`, when present, is expected-pose data used by `check-pixel-assets.js`; it is not currently regenerated by `npm run build`. Regenerate it from current source frames before relying on that check. Earlier checks may target old selectors, counts, dimensions, or artwork. Use the changed state's observable behavior and the current manifests as the specification.

Run the build before packaging. The pack currently includes all top-level state SVGs and all files in `reference/`, plus the manifest, integration guide, and preview. `previous-version/` is preserved and excluded. If new variants live in a new subdirectory, extend packaging explicitly so their downloads are included.

## Gag collection

`scripts/mascot-gag-art.mjs` supplies ten `gag-*` states, already authored as extended stories rather than base/variant pairs. Speech captions are intentionally omitted. Context puffing is a deliberate user-requested block-body deformation; the four original legs and eyes remain. Optional `reducedFrame` metadata selects a complete representative pose for reduced motion instead of the neutral opening frame. Robot entrance/exit rectangles are intentionally cropped at the canvas edge.

## Individual GIF exports

All registered states also export to `public/mascot/gifs/<state-id>.gif`. Install `python -m pip install -r scripts/requirements-gifs.txt` before `npm run export:gifs` or `npm run release`. The SVG-only `npm run build` remains Node-only. The exporter uses original colors, transparency, nearest-neighbor 2x scaling and browser-safe 20ms samples. Done states omit the loop extension and include the terminal resting pose. Packaging writes `mascot-gifs.zip` and includes the GIF folder in the full asset pack. Verify decoded frames for transparency, disposal, timing and the correct loop metadata when changing this exporter.
