# Publishing

Before distributing the artwork publicly, resolve the permissions described in NOTICE.md. Attribution does not establish permission. Select a license for your own code/skill separately from the third-party artwork.

1. Create a public GitHub repository named `mascot-studio` under your chosen account.
2. Upload the project, including `.github/`, scripts, skills, source, public assets, sharing files, README and NOTICE. Exclude `.claude/`, temporary output, and local settings.
3. Run `npm run release`. Attach the three ZIPs in `release/` to a `v1.0.0` GitHub Release.
4. In Settings > Pages, select GitHub Actions. The included workflow publishes `public/`. The preview will be at `https://ACCOUNT.github.io/mascot-studio/mascot/` (replace account/repo as needed).
5. Replace `[PREVIEW_URL]` and `[REPO_URL]` in POSTS.md with the real links.
6. Attach `mascot-showcase.mp4` directly to Reddit/Discord. Use `mascot-showcase.png` as a still preview. Post in relevant showcase/resources channels and check community promotion rules.

## Release description

22 animated SVG activity states with a browser preview, React integration, editable source, and the Mascot Studio creation skill. The skill supports new characters, activities, and accessories from a supplied brief.

Download `mascot-assets.zip` for the preview and assets, `mascot-studio.zip` for the complete skill, or `mascot-studio-source.zip` for the editable project and skill together. Node.js 18+ is required to rebuild; the generated preview opens directly in a browser.

Unofficial community project. Reference animation: Ayotomiwa Wale-Durojaye. Claude character: Anthropic. See NOTICE.md for reuse status.

## Reddit comparison GIF

Use `reddit-mascot-showcase.gif` for a 12-second, 800px square loop showing original states alongside all eight accessory variants. An MP4 alternative and still cover are included.

To regenerate on Windows: install Pillow for Python, then run `python scripts/render-reddit-showcase.py`. The renderer reads the current source poses through Node.js and uses Windows Segoe UI fonts. Export the MP4 with FFmpeg from the GIF if needed.
