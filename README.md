# Mascot Studio

22 animated Claude mascot states, transparent SVG exports, a React component, and a reusable coding-agent skill for creating characters, activities, and accessories.

Unofficial community project. Reference animation by Ayotomiwa Wale-Durojaye; Claude character by Anthropic. Artwork redistribution permission remains unverified. Read [attribution and reuse status](NOTICE.md).

[Source and releases](https://github.com/Harriszed/mascot-studio) ? [Browser preview](https://harriszed.github.io/mascot-studio/mascot/)

## Use the mascots

Extract `mascot-assets.zip` and open `index.html` in a browser. Preview states, pause/replay, change speed, and download individual SVGs. For React, copy `ClaudeMascot.tsx` and its neighbouring `artwork.json` into your app. See the [integration guide](public/mascot/README.md).

## Create more

Clone this repo or extract `mascot-studio-source.zip`. The skill needs the editable project; the asset ZIP alone is insufficient.

Install the entire `skills/mascot-studio/` folder in your coding agent's supported skill directory, including its scripts, references, and metadata. Alternatively, tell your agent to read `skills/mascot-studio/SKILL.md` in this checkout and follow it. The skill requires local file and command access.

Example brief (replace the path with your checkout):

```text
Use the mascot-studio skill with /path/to/mascot-studio.
Add a wizard hat to idle, thinking, and walking as new variants.
Keep the originals and rebuild the preview and downloadable pack.
```

You can also request an original character or new activity. Specify the activities to include. The skill edits source generators and regenerates exports.

## Run and rebuild

Node.js 18+; no packages need installing. Commands work on Windows, macOS, and Linux.

```sh
npm run dev
```

Open http://127.0.0.1:3000/mascot/index.html. The generated preview also opens directly from `public/mascot/index.html`.

```sh
npm run release
```

Creates three downloads in `release/`:

- `mascot-assets.zip`: preview, SVGs, references, manifests, guide, and notice.
- `mascot-studio.zip`: complete creation skill and notice.
- `mascot-studio-source.zip`: editable project, skill, and preview.

The preview download is refreshed at `public/mascot/claude-mascot-svg-pack.zip`.

## Source layout

| Folder | Contents |
| --- | --- |
| `public/mascot/` | Preview and exports |
| `src/components/claude-mascot/` | React component and artwork |
| `scripts/` | Drawing pipeline, preview builder, server, portable packager |
| `skills/mascot-studio/` | Portable skill and supporting resources |
| `sharing/` | Post drafts, media, and publishing guide |

See [publishing instructions](sharing/PUBLISHING.md) for releases and the hosted preview.
