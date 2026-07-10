# Banner

The hero banner shown at the top of the README and as the GitHub social preview.

## Files

- `banner.html` — source HTML (open in browser to view/edit)
- `banner.png` — 1280×640 PNG used in README and as GitHub social preview

## How to regenerate the PNG

1. Open `banner.html` in Chrome/Edge
2. Set viewport to exactly 1280×640 (use DevTools device toolbar)
3. Screenshot the page (Ctrl+Shift+P → "Capture full size screenshot")
4. Save as `banner.png` in this folder

## Customization

Edit `banner.html`:

- **Repo name**: change `.repo-name` text
- **Tagline**: change `.tagline` text
- **Colors**: edit the gradient in `.repo-name` and `.logo-mark`
- **Feature pills**: add/remove `.pill` divs
- **Color palettes**: edit the `.palette-group` sections
- **Author**: change `.author-name` text

## GitHub social preview

To set this as the repo's social preview (shows when people link the repo on social media):

1. Repo → Settings → Social preview
2. Upload `banner.png`
3. Save
