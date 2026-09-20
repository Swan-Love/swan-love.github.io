SwanLove
========

Source for [swanlove.co.uk](http://www.swanlove.co.uk), built with
[kiss-ssg](https://github.com/cprobert/kiss-ssg).

## Building

```
npm install
npm run build    # one-shot build into ./docs — what GitHub Pages serves
npm run dev      # live-reloading preview on http://127.0.0.1:3001
npm run check    # dry-run build: page diffs, asset changes, broken links
```

`npm run dev` builds into `./.kiss-dev` (git-ignored) so a preview build never
lands in the published folder.

## How the site is laid out

`router.js` is the whole site plan: every page, its title, its description and
where its data comes from. Everything else hangs off the folders kiss-ssg
expects.

```
router.js              the build script — the page table lives here
helpers/               custom Handlebars helpers (currently one: {{url}})
src/
  layouts/             layout.hbs (inner pages) and home.hbs (the home page)
  pages/               one .hbs per page, each filling its layout's blocks
  partials/            shared markup: site/, home/, about/, events/, sponsors/
  models/              about.json, sponsors.json — page data, not markup
  controllers/         about.js, which chunks people into Bootstrap rows
  assets/              css (sass sources), js, images, fonts, mp3, CNAME
docs/                  build output, committed, served by GitHub Pages
```

Assets are copied to the root of the build, so `src/assets/css/layout.scss`
becomes `docs/css/layout.css` and every URL the site has always published still
resolves. Templates ask for asset paths with `{{asset "css/layout.css"}}` and
for other pages with `{{link "about"}}`, so a renamed page or a moved file
fails the build instead of shipping a dead link.

## Publishing

GitHub Pages must be pointed at **this branch, `/docs` folder** (Settings →
Pages → Build and deployment → Deploy from a branch). The previous SCMS build
published from the repository root; the root `.html` files it produced have
been removed along with the `_pages/` and `_layouts/` sources they came from.
