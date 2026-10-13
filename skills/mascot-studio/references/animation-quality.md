# Animation quality for mascot sets

Research reviewed 2026-10-13. Artist tutorials and official documentation inform this guide; the adaptations to this mascot are project judgments. These are decision criteria, not universal frame counts, palettes or timing rules.

## Preserve the actual reference

Compare a new pose beside the original at the intended display size. A smoother-animation request changes motion, not anatomy. Reuse the original actor, palette, drawing scale and silhouette. Integer coordinates alone do not preserve style: thin rasterized curves, rounded feet and a finer grid can still redesign the character.

For this Claude project, retain the 85 by 65 torso, four 11px-wide rectangular legs, original eyes and 22 by 23 resting arms. New arm silhouettes use connected blocks and coarse steps. Preserve measured offsets instead of imposing another grid. A deformation requested for one gag does not authorize deforming every activity.

Keep detail density and palette consistent through a sequence. For raster exports, draw at native resolution and enlarge with nearest-neighbor integer scaling. Keep the existing SVG block-art pipeline; raster tutorials do not require converting its source. [Pedro Medeiros: style consistency](https://saint11.art/blog/consistency/) distinguishes consistent artwork from deliberately separate UI styles.

## Stage an action that reads without its caption

Pick the defining gesture and important prop; remove competing details. Check the silhouette and face at actual display size before polishing. Low resolution rewards selective information. [Medeiros: very low resolution](https://saint11.art/blog/thoughts_on_low_resolution/).

Anchor a held prop to the hand and respect its target, not just its coordinates. Keep eyes readable unless occlusion is intentional. If the character lacks a feature needed to make an action convincing, revise the scene: for this mouthless actor, tabletop coffee preparation reads more clearly than bringing a mug toward an eye. This is a staging choice, not a ban on drinking animations for other characters.

## Block poses before adding drawings

Start with the reference still and rough key poses. Establish anticipation, action, accent and recovery as applicable, then play those poses with provisional holds. Add in-betweens where the path or gesture is unclear. This adapts [Medeiros's planning workflow](https://www.patreon.com/posts/animation-7585006).

Unique drawing count and playback rate are separate choices. Pixel animation can communicate an action with few drawings; extra frames should improve a transition, weight or expression. [Adafruit's sprite animation guide](https://learn.adafruit.com/makecode-arcade-pixel-animation/sprite-animation-fundamentals) demonstrates this economy. When the user requests more frames, spend them on useful breakdowns or a richer story while retaining the reference style.

## Shape timing and spacing independently

Timing is how long a pose is shown; spacing is how far important landmarks move between poses. Tight spacing can communicate a slow approach, larger spacing acceleration. Anticipation and a small overshoot can strengthen a decisive action. Author these changes as discrete poses and holds rather than smooth transforms. [Medeiros: animation easing](https://saint11.art/img/pixel-tutorials/Easings.gif).

Adjust holds before redrawing a weak sequence. Let the setup register, carry the action, hold its useful result, and allow recovery. Quiet waiting and a fast launch need different rhythms; there is no single best FPS or minimum hold for all states. [Aseprite frame duration](https://www.aseprite.org/docs/frame-duration/) supports individual and selected-frame holds.

## Keep pixel clusters stable over time

Treat the body, eyes, outline and shading as coherent groups of pixels. Edge-connected shapes read differently from fragile diagonal contacts; isolated pixels can attract disproportionate attention. Particles and accents can use isolated pixels deliberately. [Medeiros's glossary](https://saint11.art/blog/glossary/).

Compare neighboring poses for accidental contour changes, wandering outlines, changing limb thickness and unrelated highlights. Texture that changes on a still surface can look like boiling or flicker. Frame differences help locate changes, but a changed-pixel count cannot judge quality: a blink and a meaningless noise patch can change similar areas.

Use previous/next-frame overlays to track eyes, wrist/prop contact, torso edges and foot contacts. [Aseprite onion skinning](https://www.aseprite.org/docs/onion-skinning/) provides such overlays; equivalent comparisons can be made from authored rectangles.

## Give secondary motion a cause

Let the main gesture lead and a small supporting element follow or settle afterward. Avoid moving every part in lockstep or animating everything to make a loop busy. [Medeiros: character idle](https://saint11.art/img/pixel-tutorials/characterIdle.gif) demonstrates holds, personality and delayed secondary movement.

For this block actor, gaze, a restrained hand gesture or slowly rising steam can carry an idle. If a whole-body step feels too large, keep the body stable and use a local gesture. Preserve supported feet during stationary actions; deliberate hops or walking can lift them. Walking needs coherent contact and weight transfer; retain the measured gait unless asked to revise it.

## Choose special techniques to match the source

| Technique | Useful application | Constraint for this mascot |
| --- | --- | --- |
| Local cluster/interior changes | Subtle motion without translating the whole silhouette | Preserve block scale and palette; avoid finer-grid limbs. |
| Authored subpixel illusion | Detailed sprites with movement smaller than a full pixel step | Optional for the flat actor; prefer gaze, holds and local poses here. |
| Directional smear/block trail | Fast gestures whose direction is difficult to read | Brief and purposeful, with recognizable poses before and after. |

[Medeiros: subpixel movement](https://saint11.art/img/pixel-tutorials/Subpixel.gif) includes moving part of a shape, altering interior pixels and palette-based edge illusions. Manually authored edge colors can be valid pixel art; they differ from automatic smoothing. Not every style needs anti-aliasing or extra colors.

[Medeiros: motion blur](https://saint11.art/img/pixel-tutorials/MotionBlur.gif) illustrates connecting a fast movement's path with a smear. Borrow directional clarity when needed; complementary-color flashing from that tutorial is unsuitable as a default for these persistent loops. A smear can look unusual paused; judge its contribution at intended speed rather than demanding every transient frame work as a still illustration.

## Design the loop boundary

Inspect last-to-first position, direction, pace and phase. Equal endpoint drawings can introduce an unintended pause when both receive a hold; different drawings can loop naturally if motion continues. [Medeiros: seamless looping](https://saint11.art/img/pixel-tutorials/loop.gif) treats the ending as a predecessor to the opening and varies overlapping motions' phases.

Repeating stories need readable recovery and reset; continuous cycles need rhythm through the seam. Match the complete combined cycle, including particles and accessories, not only the torso. Keep one-shot completion states distinct from loops and give them intentional terminal poses.

## Keep persistent states comfortable

Distinguish object motion from repeated bright/dark or saturated-color alternation. For waiting and thinking, prefer stable surfaces, meaningful gestures and sparse accents. An idea can appear and remain steady. Inspect several loops, including the seam, at the largest intended display size. [W3C flashing guidance](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) considers frequency, area and contrast; FPS or a minimum hold alone does not establish flashing safety.

Improve uncomfortable flashing in the normal animation as well as preserving pause/replay and a readable reduced-motion pose. The quiet-thinking replacement is a useful example, not a requirement that every animation be slow.

## Verify the delivered animation

Use checks relevant to the change:

1. Watch at native and intended display sizes; the action and important expression should read clearly.
2. Compare against the original at equal scale. Inspect representative poses and intervening frames for anatomy, contact and layering.
3. Watch several normal-speed loops, then inspect slow playback for contour noise, detached props and abrupt seams. Evaluate intentional smears at intended speed.
4. Confirm exactly one complete pose is visible, without blank frames or double-image crossfades.
5. Check light/dark canvases, transparent bounds, pause/replay, speed controls and the reduced-motion still.
6. Decode the exported GIF as well as viewing the SVG. Compare colors, transparency, disposal, duration and loop/one-shot behavior. [Pillow GIF documentation](https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html#gif) documents these independent settings.

An export's sampling rate is not its drawing count. This project's GIF exporter samples at 20ms intervals and merges identical frames; preserve authored SVG timing and verify the approximation rather than retiming the source to match GIF. Extension points and measured walking/Done contracts live in [pixel-pipeline.md](pixel-pipeline.md).
