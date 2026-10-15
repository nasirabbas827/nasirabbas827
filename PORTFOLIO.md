# Nasir StackLab portfolio

Static, responsive portfolio for Nasir Abbas. Website source lives in `docs/`; the root profile README is preserved.

## Publish on GitHub Pages

In repository Settings → Pages:
1. Source: **Deploy from a branch**.
2. Branch: **main**; folder: **/docs**.
3. Save and wait for GitHub's Pages deployment to finish.

GitHub will display the live URL after publication. No build, package installation, API keys, or paid services are required.

## Editing

- `docs/index.html`: biography, curated project summaries, and contact links.
- `docs/styles.css`: responsive layout and motion graphics.
- `docs/script.js`: project filters, navigation, motion controls, clipboard, and on-demand recent GitHub projects.
- `docs/assets/nasir-abbas.jpg`: user-provided portrait, optimized as JPEG.

The three curated project descriptions are based on their public READMEs. The project artwork is illustrative, not a screenshot of the applications. The recent-repositories panel retrieves public data on demand, excludes forks and archived repositories, and has rate-limit/error handling. It does not require credentials and does not expose private repositories. Curated summaries do not update automatically.

Motion respects the visitor's reduced-motion setting and can be paused. Contact uses email links; there is no pretend message form or collection backend. The site uses Google Fonts with system fallbacks. No analytics or tracking scripts are included.
