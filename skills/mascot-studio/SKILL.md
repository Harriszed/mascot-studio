---
name: mascot-studio
description: Create or modify SVG and pixel mascots from an existing source folder, including new characters, animation states, hats, outfits, and accessories. Use for reusable mascot assets and their code, previews, and exports; exclude ChatGPT Work pets and standalone raster images.
---

# Mascot Studio

Extend the mascot project the user points to. Deliver editable source, working animation exports, an updated preview, and its downloadable pack when the project has one.

## Start with the source folder and the user's brief

1. Use the source folder supplied in the current request. A project root, `src/components/claude-mascot/`, or `public/mascot/` are all valid starting points. Never substitute another project for an invalid explicit path.
2. If no path was supplied, inspect the current workspace for this project's README and mascot generators; otherwise ask for the source folder. Resolve the actual project root and read applicable `AGENTS.md`, its README, source generators, and manifests. For the existing pixel-mascot pipeline, run the read-only helper:

   ```sh
   node <skill-folder>/scripts/inspect-source.mjs "<supplied-source-folder>"
   ```

   Replace both placeholders with actual paths. For a different layout, inspect that layout directly rather than assuming the Claude filenames apply.
3. If the request only invokes the skill or supplies a folder, inspect it first, then ask: **"What would you like to create or change: a new character, new animation states, or hats/accessories for these mascots? Describe the look and which states it should apply to."** Stop before making creative changes and wait for the answer. This is a missing design brief, not an approval checkpoint.
4. If the user already described the change, use that brief. Ask only about material gaps: which base character, which activities, the accessory or appearance, and whether to add variants or replace existing assets. Bundle needed questions into one concise prompt. For an unspecified activity selection, ask rather than applying an accessory to every animation.

## Create characters, activities, and accessories

- Treat the chosen source as the visual and technical reference. Inspect its actual artwork and preview before drawing. Preserve its proportions, palette, drawing style, layering, and timing unless the user requests a change. For an explicitly different character, adapt those conventions to its new silhouette and maintain its identity across poses.
- A request for smoother or more impressive animation is not a request to redesign the character. Extend the original block poses, coarse pixel steps, and action sequences first. Integer coordinates alone do not preserve pixel style: avoid replacing thick rectangular limbs with thin rasterized curves or introducing a finer drawing grid.
- For **a new character**, use a separately named character or collection and keep the original available. Inherit only the activities and accessories requested in the brief; the existing collection's 22 states are a starting point, not a required total.
- For **a new activity**, implement its editable pose sequence and add a stable identifier, title, description, duration, and loop behavior to the source registry. Connect it to the preview, component's supported state types, manifests, and exports.
- For **hats, clothing, and accessories**, prefer named variants that reuse the base poses and timing. Use reusable drawing helpers or variant definitions for repeated accessory geometry. Attach each accessory to the correct head, face, hand, or torso anchor in every pose; respect occlusion and keep it inside the exported canvas. Preserve the originals unless replacement is explicitly requested.
- Keep character/accessory identity separate from activity meaning. A hat on `walking` retains the walk cycle; a hat on `done` retains completion semantics. Track the base state in variant metadata when the runtime needs it; don't infer behavior from a filename suffix.
- Edit the source of truth and regenerate its outputs. Hand changes to generated SVGs, compiled artwork, or preview HTML are overwritten by the next build. Keep original measured reference data available when introducing a new character or a variant.

For this project's generator, coordinates, special states, and extension points, read [references/pixel-pipeline.md](references/pixel-pipeline.md). Read it when working on the supplied Claude Mascot layout, not as a mandate to convert other projects.

## Build, inspect, and deliver

For new or improved animation sets, read [references/animation-quality.md](references/animation-quality.md). It covers pixel readability, anchored rigs, action timing, seamless loops, and comparison against the existing set. Apply interface transition rules to the preview controls; preserve deliberate sprite timing in the character itself.

Use the selected project's own commands and dependencies. The Claude Mascot project uses `npm run build`, `npm run pack:assets`, and `npm run dev`; inspect its package scripts before running them.

Verify the changed character or accessory across the affected poses and loop boundaries, not only the first frame. Check attachment, layering, clipping, transparent exports, playback speed, pause/replay, and reduced motion. Preserve existing one-shot and walking behavior where applicable. Use the current source and manifest counts rather than a fixed state total. Inspect the changed states in the browser and save useful preview screenshots in the selected project's output folder.

Rebuild the downloadable pack after source or export changes. Check that the new assets appear in the preview and ZIP, originals remain available when adding variants, and the React API accepts the new identifiers. Refresh stale expected-pose data before reusing older browser checks; filenames containing `21` or `22` are historical, not the current specification.

Finish with the actual source/output locations, preview link when running, identifiers added or changed, and a short verification result. For a source-only invocation, finish with the design-brief question instead of claiming assets were created. Installation of this skill does not itself add any new mascots or accessories.
