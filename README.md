# Atelier Lite: website

The landing page for [Atelier Lite](https://github.com/mathanmj92/atelier-lite): a Windows desktop suite with a word processor, slides, a spreadsheet and a PDF editor in one window, plus one AI assistant.

The page shows what the app does, the four apps with their shortcuts, the workspace and AI features, system requirements and a Download button that points at the latest release of the app repository.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page |
| `styles.css` | Styling, with light and dark themes that follow the visitor's system setting |
| `script.js` | The app switcher (Documents, Presentation, Spreadsheet, PDF Editor) and small interactions |
| `assets/` | The app icon |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

A static page with no build step. The only external request is the web fonts from Google Fonts.

## Preview locally

```
npx serve .
```

or just open `index.html` in a browser.

## Publish

GitHub Pages is not available for private repositories on the free plan. When the repositories are made public: **Settings, Pages, Deploy from a branch, `main`, folder `/`**. The page is then at `https://mathanmj92.github.io/atelier-lite-site/`.

## Updating for a new version

1. Change the version and size in the Download section of `index.html` ("Download Atelier Lite 1.0.0", "about 160 MB").
2. Make sure the release exists in [`atelier-lite`](https://github.com/mathanmj92/atelier-lite/releases); the button links to `releases/latest`.
