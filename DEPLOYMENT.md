# Deployment Guide — Netlify

This is a Next.js 16 app with API routes (OAuth, script generation, shame system). Deploy to Netlify using the official Next.js plugin.

## Step 1 — Push to GitHub

```bash
# Create the repo on GitHub first: mhmmmm000000/rocketgoal-name-tools (public)
# Then push these files:

cd /home/z/my-project/download/github-repo
git init
git add .
git commit -m "initial commit: rocketgoal-name-tools"
git branch -M main
git remote add origin https://github.com/mhmmmm000000/rocketgoal-name-tools.git
git push -u origin main
```

## Step 2 — Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `rocketgoal-name-tools`
   - **Homepage URL**: `https://YOUR-NETLIFY-NAME.netlify.app` (use a placeholder for now, you'll fix after deploy)
   - **Authorization callback URL**: `https://YOUR-NETLIFY-NAME.netlify.app/api/auth/callback`
4. Click **Register application**
5. Note your **Client ID**
6. Click **Generate a new client secret** → note your **Client Secret** (you can't see it again)

## Step 3 — Deploy to Netlify

1. Go to https://app.netlify.com/start
2. Click **Import an existing project** → choose GitHub
3. Select your repo: `mhmmmm000000/rocketgoal-name-tools`
4. Netlify auto-detects Next.js. Settings:
   - **Build command**: `bun run build` (or `npm run build`)
   - **Publish directory**: `.next`
   - **Plugin**: `@netlify/plugin-nextjs` (auto-installed from `netlify.toml`)
5. Under **Advanced** → **Environment variables**, add:
   - `OAUTH_CLIENT_ID` = your client ID from Step 2
   - `OAUTH_CLIENT_SECRET` = your client secret from Step 2
   - `OAUTH_REDIRECT_URI` = `https://YOUR-NETLIFY-NAME.netlify.app/api/auth/callback`
   
   **Note:** GitHub rejects env var names starting with `GITHUB_` (they reserve that prefix), so we use `OAUTH_` instead.
6. Click **Deploy site**
7. Wait 2-3 minutes for the build to finish
8. Note your Netlify URL (e.g., `https://rocketgoal-name-tools.netlify.app`)

## Step 4 — Update GitHub OAuth App with real URL

1. Back in your GitHub OAuth App settings
2. Update **Homepage URL** → `https://YOUR-NETLIFY-NAME.netlify.app`
3. Update **Authorization callback URL** → `https://YOUR-NETLIFY-NAME.netlify.app/api/auth/callback`
4. In Netlify: Site settings → Environment variables → update `OAUTH_REDIRECT_URI` to match
5. Trigger a redeploy (Deploys → Trigger deploy → Deploy site)

## Step 5 — Update README with real URL

In `README.md`, replace `https://rocketgoal-name-tools.netlify.app/` with your actual Netlify URL.

## Step 6 — Test the flow

1. Open your live Netlify URL in incognito
2. Click **Unlock generator**
3. Follow the popup steps:
   - Follow yourself on GitHub (yes, you can)
   - Star your own repo
   - Click "Verify with GitHub"
4. GitHub OAuth redirects back → site unlocks
5. Customize your name (try "LITE" with Ocean style, curve on)
6. Click **Generate Script**
7. Copy the encrypted script
8. Test it on rocketgoal.io:
   - Open rocketgoal.io, log in
   - Press F12 → Console tab
   - Paste the script, press Enter
   - Change your name in the game UI (type anything, submit)
   - Refresh the page (F5)
   - Your name is now styled!
   - Score a goal to see the curved gradient banner

## Environment variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OAUTH_CLIENT_ID` | GitHub OAuth App client ID | ✅ |
| `OAUTH_CLIENT_SECRET` | GitHub OAuth App client secret | ✅ |
| `OAUTH_REDIRECT_URI` | OAuth callback URL (must match OAuth App settings) | ✅ |

**Important:** Don't use `GITHUB_*` prefix for env var names — GitHub rejects it. Use `OAUTH_*` instead.

## Customization

### Change required user/repo (people must follow/star YOU)

Edit `src/app/api/generate/route.ts`:
```ts
const REQUIRED_USER = "your-username";
const REQUIRED_REPO = "your-repo-name";
```

Edit `src/app/api/auth/callback/route.ts`:
```ts
const REQUIRED_USER = "your-username";
const REQUIRED_REPO = "your-repo-name";
```

Edit `src/app/page.tsx`:
```ts
const GITHUB_USER = "your-username";
const GITHUB_REPO = "your-repo-name";
```

### Change the watermark

In `src/app/api/generate/route.ts`, find:
```ts
parts.push(`<size=18><color=#666666>github.com/${REQUIRED_USER}</color>`);
```
Replace with whatever you want.

### Change the shame payload

In `src/app/api/generate/route.ts`, edit the `SHAME_PAYLOAD` constant. Currently it sets the name to `IM A LOSER UNFOLLOWED` in red.

### Add more styles

In `src/app/api/generate/route.ts`, add to `STYLE_COLORS`:
```ts
yourstyle: ["#color1", "#color2", "#color3", "#color4"],
```

In `src/app/page.tsx`, add the matching entry to the `STYLES` constant and the `Style` type.

## Alternative deployments

### Vercel (also works perfectly)

1. Go to https://vercel.com/new
2. Import the same repo
3. Add the same 3 env vars
4. Deploy — Vercel auto-detects Next.js, no plugin needed

### Self-host

```bash
git clone https://github.com/mhmmmm000000/rocketgoal-name-tools.git
cd rocketgoal-name-tools
bun install
cp .env.example .env
# Edit .env with your GitHub OAuth credentials
bun run build
bun run start
```

Run behind a reverse proxy (Caddy/Nginx) with HTTPS.

## Troubleshooting

**"GitHub OAuth not configured"** — env vars not set on Netlify. Check Site settings → Environment variables.

**Auth callback redirects to `?auth=error`** — redirect URI in env vars doesn't match OAuth App settings on GitHub.

**Auth says `?auth=incomplete&reason=follow`** — you haven't followed @mhmmmm000000 yet. Do it on GitHub first.

**Auth says `?auth=incomplete&reason=star`** — you haven't starred the repo yet.

**Generate button shows "Verification failed — IM A LOSER UNFOLLOWED"** — you un-followed or un-starred after unlocking. Re-follow, re-star, refresh, unlock again.

**Name doesn't change in game** — rocketgoal.io patched it, or you didn't refresh the game page after running the script. Check browser console for errors.

**Build fails on Netlify** — check the build log. Most common cause: missing env vars. The plugin `@netlify/plugin-nextjs` is required — it's already in `netlify.toml`.

## Custom domain (optional)

1. Netlify: Site settings → Domain management → Add custom domain
2. Add CNAME record in your DNS pointing to your Netlify subdomain
3. Netlify auto-provisions HTTPS via Let's Encrypt
4. Update `OAUTH_REDIRECT_URI` and OAuth App URLs to use the custom domain

## Costs

Netlify free tier includes:
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

This app will use a tiny fraction of those limits. Free forever.
