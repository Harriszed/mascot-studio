# Animation quality for mascot sets

## Preserve the actual reference

Compare a new pose beside the original at the intended display size. A smoother-animation request changes motion, not anatomy. Reuse the original actor, props, palette, and block dimensions. Integer coordinates alone do not make a matching pixel style. Thin rasterized curves, rounded feet, smoothly scaled torsos, and a finer grid change the character even when every rectangle has integer coordinates.

For the Claude project, keep the 85 by 65 torso, four 11px-wide rectangular legs, the original 22 by 23 resting arms, and the original eyes. New arm silhouettes should use the same thick connected blocks and coarse 5px changes. The source contains some measured offsets outside a uniform grid; preserve those offsets instead of imposing a new raster rig. Preserve SVG exports for this block-art pipeline. Raster exports use lossless PNG or GIF and nearest-neighbor integer scaling.

## Make the action more expressive

Author key poses and useful in-betweens with deliberate hold times. Use anticipation, action, a readable accent, and recovery. A thought can lead to an idea; a wave can include a bow; a page can turn through several block silhouettes; test results can arrive one at a time. Quiet states still need pauses. More samples of a drifting rig are not a substitute for an interesting action.

Use the original prop helpers so the book, pencil, and symbols retain their visual scale. Keep limbs connected and props layered consistently through every pose. More frames should refine the action without shrinking pixels, rounding corners, morphing anatomy, or dissolving whole sprites together. For walking, prefer the measured original rectangular gait and additional leg-height poses over a new joint skeleton.

## Verify and compare

Show original and revised states side by side at equal scale. Inspect key poses, every in-between, normal and slow playback, loop boundaries, prop layering, transparent exports, light and dark backgrounds, pause/resume, replay, and reduced motion. A looping story should settle back into its initial pose or continue a deliberate cyclic action. A one-shot needs a readable terminal pose.

Verify the reference torso and limb widths across the revised set, not only coordinate integrality. Check that exactly one complete pose is visible during playback. The original collection remains available when adding variants. UI transition rules apply to preview controls; short UI duration recommendations do not constrain character cycles.

## Current extended pixel collection

`scripts/mascot-fluid-art.mjs` now defines weighted key-pose storyboards (with `scripts/mascot-extended-activities.mjs` for the additional activities) using helpers supplied by `scripts/mascot-pixel-art.mjs`. All 22 `*-fluid` identifiers are available for compatibility, with `style: original-block-pixel` metadata and extended-pixel labels. The walking variant retains measured original rectangular anatomy and adds coarse leg-height poses. `public/mascot/fluid.html` compares the originals and the revised pixel sequences.
