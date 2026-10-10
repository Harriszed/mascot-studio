# Mascot Studio

22 animated Claude mascot states, transparent SVG exports, a React component, and a reusable coding-agent skill for creating characters, activities, and accessories.

[**Live playground**](https://harriszed.github.io/mascot-studio/mascot/) · [**Download v1.0.0**](https://github.com/Harriszed/mascot-studio/releases/tag/v1.0.0) · [**Creation skill**](skills/mascot-studio/SKILL.md)

[![Animated showcase of Claude mascot activity states](sharing/mascot-showcase.gif)](https://harriszed.github.io/mascot-studio/mascot/)

*A few of the activity states in motion. Click the preview to explore all 22, change speed, and download individual SVGs.*

## Meet the states

<table>
  <tr>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#idle"><img src="public/mascot/idle.svg" width="150" alt="Idle mascot waiting" /></a><br /><strong>Idle</strong></td>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#thinking"><img src="public/mascot/thinking.svg" width="150" alt="Mascot thinking" /></a><br /><strong>Thinking</strong></td>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#reading"><img src="public/mascot/reading.svg" width="150" alt="Mascot reading a book" /></a><br /><strong>Reading</strong></td>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#writing"><img src="public/mascot/writing.svg" width="150" alt="Mascot writing" /></a><br /><strong>Writing</strong></td>
  </tr>
  <tr>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#using-tool"><img src="public/mascot/using-tool.svg" width="150" alt="Mascot lifting weights while using a tool" /></a><br /><strong>Using a tool</strong></td>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#directing-helpers"><img src="public/mascot/directing-helpers.svg" width="150" alt="Mascot directing smaller helper mascots" /></a><br /><strong>Directing helpers</strong></td>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#testing"><img src="public/mascot/testing.svg" width="150" alt="Mascot testing" /></a><br /><strong>Testing</strong></td>
    <td align="center"><a href="https://harriszed.github.io/mascot-studio/mascot/#walking"><img src="public/mascot/walking.svg" width="150" alt="Mascot walking" /></a><br /><strong>Walking</strong></td>
  </tr>
</table>

Each tile opens its state in the live playground. If your Markdown viewer shows the SVGs as still images, use the playground for full playback.

<details>
<summary>See the collection at a glance</summary>

![Gallery of mascot states with activity labels](sharing/mascot-showcase.png)

</details>

## Pick your download

| You want to… | Download | Includes |
| --- | --- | --- |
| Use the ready-made animations | [Asset pack](https://github.com/Harriszed/mascot-studio/releases/download/v1.0.0/mascot-assets.zip) | SVGs, preview, state mapping, and integration guide |
| Install the creation skill | [Mascot Studio skill](https://github.com/Harriszed/mascot-studio/releases/download/v1.0.0/mascot-studio.zip) | Skill instructions, helper script, and pipeline reference |
| Edit the mascots and create more | [Complete source](https://github.com/Harriszed/mascot-studio/releases/download/v1.0.0/mascot-studio-source.zip) | Editable project, preview, and skill together |

> Unofficial community project. Reference animation by [Ayotomiwa Wale-Durojaye](https://ayotomcs.me/claude-mascot); Claude character by Anthropic. Artwork redistribution permission remains unverified. Read [attribution and reuse status](NOTICE.md).

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
