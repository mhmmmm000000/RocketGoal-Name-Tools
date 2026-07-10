<div align="center">

<img src="docs/banner.png" alt="RocketGoal Name Tools" width="100%"/>

# RocketGoal Name Tools

Custom name styling tools for [rocketgoal.io](https://rocketgoal.io).

Style your in-game name with curves, gradients, and promo text — works in live matches, everyone sees it.

[![Live Site](https://img.shields.io/badge/live%20site-rocketgoal--name--toolss.netlify.app-cyan?style=flat-square)](https://rocketgoal-name-toolss.netlify.app/)
[![GitHub stars](https://img.shields.io/github/stars/mhmmmm000000/RocketGoal-Name-Tools?style=flat-square&color=yellow)](https://github.com/mhmmmm000000/RocketGoal-Name-Tools/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mhmmmm000000/RocketGoal-Name-Tools?style=flat-square&color=blue)](https://github.com/mhmmmm000000/RocketGoal-Name-Tools/forks)
[![GitHub issues](https://img.shields.io/github/issues/mhmmmm000000/RocketGoal-Name-Tools?style=flat-square&color=red)](https://github.com/mhmmmm000000/RocketGoal-Name-Tools/issues)
[![Profile views](https://komarev.com/ghpvc/?username=mhmmmm000000&color=cyan&style=flat-square&label=profile+views)](https://github.com/mhmmmm000000)
[![Repo views](https://img.shields.io/endpoint?url=https://hits.dwyl.com/mhmmmm000000/RocketGoal-Name-Tools.json&color=cyan&style=flat-square&label=repo+views)](https://github.com/mhmmmm000000/RocketGoal-Name-Tools)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Made by](https://img.shields.io/badge/made%20by-%40mhmmmm000000-fuchsia?style=flat-square)](https://github.com/mhmmmm000000)
[![Deployed on Netlify](https://img.shields.io/badge/deployed%20on-netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://www.netlify.com/)

**[🚀 Live tool](https://rocketgoal-name-toolss.netlify.app/)** · **[⭐ Star this repo](https://github.com/mhmmmm000000/RocketGoal-Name-Tools)** · **[👤 Follow @mhmmmm000000](https://github.com/mhmmmm000000)**

</div>

---

## Star History

<a href="https://star-history.com/#mhmmmm000000/RocketGoal-Name-Tools&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=mhmmmm000000/RocketGoal-Name-Tools&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=mhmmmm000000/RocketGoal-Name-Tools&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=mhmmmm000000/RocketGoal-Name-Tools&type=Date" />
  </picture>
</a>

---

## What this is

A Next.js web app that generates an encrypted browser-console script for setting your rocketgoal.io nickname with rich-text styling — curved rainbow letters, neon colors, optional `SUB TO` + YouTube URL promo.

**Live tool:** **https://rocketgoal-name-toolss.netlify.app/**

To use the generator, you must:
1. ⭐ Star this repo
2. 👤 Follow [@mhmmmm000000](https://github.com/mhmmmm000000)
3. 🔑 Verify with GitHub OAuth (1 click)

The app re-verifies on every script generation. If you un-follow or un-star after unlocking, the script will set your in-game name to `IM A LOSER UNFOLLOWED`. Don't game the system.

## Features

- 🎨 **20+ style presets** — Ocean, Sunset, Cyber, Inferno, Matrix, Gold, Plasma, Toxic, Acid, and more
- 🌈 **Curved names** — smile (⌣) or frown (⌢) arc, per-letter rotation
- 🎨 **Color customization** — pick SUB TO color (9 options) and URL color (6 options)
- 🔒 **Encrypted scripts** — XOR + base64 obfuscated, can't be casually copied
- 🛡️ **Server-verified unlock** — re-checks follow/star on every generation
- 🔐 **OAuth 1-click connect** — connect first, then follow/star steps appear
- 📱 **Fully responsive** — works on mobile, tablet, desktop
- 🌙 **Glassmorphism dark mode** — sleek, translucent UI
- 🎯 **Open rocketgoal.io button** — direct link from generated script panel

## How it works

The rocketgoal.io nickname field accepts Unity TextMeshPro rich-text tags. The Firebase Cloud Function stores the nickname as a plain string without sanitizing these tags. When the name renders in the goal celebration banner, TextMeshPro parses the tags and renders styled text.

| Tag | Effect |
|-----|--------|
| `<color=#hex>` | Per-letter color |
| `<size=N>` | Text size |
| `<rotate=N>` | Per-letter rotation |
| `<voffset=N>` | Vertical offset |
| `<b>` | Bold |

## Quick start (for users)

1. Go to the [live tool](https://rocketgoal-name-toolss.netlify.app/)
2. Click **Unlock generator**
3. Click **Connect with GitHub** (authorizes the app)
4. After connecting, you'll see two steps:
   - Click **Follow @mhmmmm000000** → opens GitHub profile
   - Click **Star the repo** → opens the repo
5. Do both on GitHub, come back, click **I did both — verify now**
6. Once verified, customize your name (style, curve, promo text, colors)
7. Click **Generate Script** and copy
8. Click **Open rocketgoal.io** button
9. Press `F12` → Console tab → paste script → Enter
10. Change your name in the game UI to trigger the hook
11. Refresh the page (F5) — your new name is live
12. Score a goal to see the curved gradient banner

## Style presets (20 total)

| Style | Colors | Style | Colors |
|-------|--------|-------|--------|
| Ocean | Blue → Teal → Green → Light Blue | Mint | Cool mint greens |
| Sunset | Coral → Orange → Yellow → Pink | Rose | Hot pinks |
| Cyber | Cyan → Magenta → Green → Yellow | Electric | Blue → Cyan → Green → Yellow |
| Ice | Light blue pastels | Plasma | Magenta → Violet → Pink → Orange |
| Royal | Deep purple gradient | Toxic | Acid greens |
| Inferno | Red → Orange → Yellow → Gold | Blood | Deep reds |
| Matrix | Green code rain | Sky | Sky blues |
| Candy | Soft pastels | Bronze | Bronze tones |
| Void | Dark purples | Arctic | Arctic ice blues |
| Gold | Premium gold tones | Acid | Acid yellow-greens |

## Customization options

- **Name** — up to 12 characters
- **Style** — 20 presets (color palettes)
- **Curve** — on/off, plus smile (⌣) or frown (⌢) direction
- **SUB TO header** — on/off, plus 9 color choices (red, orange, yellow, green, cyan, blue, purple, pink, white)
- **YouTube link** — on/off, plus 6 color choices (gray, white, cyan, yellow, green, blue)
- **YouTube @handle** — your channel handle

## Self-host

This is a Next.js 14 app. To run locally:

```bash
git clone https://github.com/mhmmmm000000/RocketGoal-Name-Tools.git
cd RocketGoal-Name-Tools
npm install --legacy-peer-deps
npm run dev
```

Set these env vars in `.env` (or your hosting platform):

| Variable | Description |
|----------|-------------|
| `OAUTH_CLIENT_ID` | GitHub OAuth App client ID |
| `OAUTH_CLIENT_SECRET` | GitHub OAuth App client secret |
| `OAUTH_REDIRECT_URI` | OAuth callback URL |

Create a GitHub OAuth App at `github.com/settings/developers` with callback URL `http://localhost:3000/api/auth/callback` (or your production URL).

Note: the code also accepts `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, `GITHUB_CLIENT_ID`, etc. — so name them whatever you want.

## Issues

If the tool stops working, it's likely because:
1. rocketgoal.io patched the rich-text injection (most likely)
2. The Firebase endpoint changed
3. GitHub OAuth app misconfigured

Open an issue and describe what happened. Don't open issues asking for cheats — this repo only covers the name tool.

## Disclaimer

- Not affiliated with rocketgoal.io or PocketHaven
- Use at your own risk — the devs could patch this any day
- Don't use offensive names
- Don't abuse the system (un-starring after unlocking = shame name)

## License

MIT — see [LICENSE](LICENSE). If you fork, keep the @mhmmmm000000 credit.

---

<div align="center">

Made by [@mhmmmm000000](https://github.com/mhmmmm000000) · ⭐ Star this repo to support

**[🚀 Use the tool](https://rocketgoal-name-toolss.netlify.app/)**

</div>
