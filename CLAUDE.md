# swanlove.co.uk

A static site built with [kiss-ssg](https://github.com/cprobert/kiss-ssg). The
engine's contract is imported below — read it before changing the build.

@node_modules/kiss-ssg/llms.txt

## Commands

```
npm run build    one-shot build into ./docs (git-ignored; CI builds and deploys it)
npm run dev      live-reloading preview on :3001, building into ./.kiss-dev
npm run check    dry-run build — page diffs, asset changes, broken links
npm run aikb     record the site's knowledge base to ./AIKB (after a passing build)
```

## Shape

`router.js` is the page table: every page, its title, description and model are
declared there and nowhere else. `helpers/` holds the site's one custom helper.
Everything under `src/` follows kiss-ssg's folder conventions.

## Conventions

- **Never hardcode an internal URL.** Pages are linked with `{{link "<id>"}}`
  and files with `{{asset "css/layout.css"}}`, so a rename fails the build
  instead of shipping a dead link. Page ids are the view's route without the
  extension — `about.hbs` is `about`.
- **Content that repeats is a model, not markup.** The people grid and the
  sponsor list are `src/models/*.json` rendered through one partial each. Adding
  a sponsor means editing JSON, not copying a `<div>`.
- **Facts the site states more than once live in `router.js`** under `site` and
  reach templates as `{{config.site.*}}`.
- **Stylesheets are the `.scss` files.** kiss-ssg compiles them; there are no
  committed `.css` siblings to keep in sync.
- **Attribute URLs coming from config or a model use `{{url ...}}`**, not bare
  `{{ }}`, which would escape `=` in a query string to `&#x3D;`.

## Deployment

`.github/workflows/deploy.yml` builds the site and deploys `./docs` as the
Pages artifact on every push to `master`. Pull requests run the same build and
`npm run check` but never publish. Pages must have **GitHub Actions** selected
as its source — not "Deploy from a branch".

`docs/` is therefore git-ignored: CI produces it, and a source change no longer
has to be committed alongside a rebuilt copy of the output.

**The site is served at its default Pages address, `https://swan-love.github.io`.**
The custom domain swanlove.co.uk has expired; Settings → Pages → Custom domain
must be empty, and there is no `CNAME` file. `siteUrl` in `router.js` is what
every canonical URL, sitemap `<loc>` and the `robots.txt` `Sitemap:` line are
built from, so a move is that one line plus a rebuild. Keep the scheme
`https://` — github.io is HTTPS-only, and `http://` would point all of them at
a redirect.

`npm run dev` deliberately builds elsewhere: dev output carries a livereload
shim and expanded CSS, and `cleanBuild: 'atomic'` degrades to a plain clean in
dev, so pointing it at `./docs` would leave a preview build in the published
folder.

## Gotchas

- The build folder cannot contain `src/`. kiss-ssg refuses it at construction
  (`assertBuildFolderIsSafe`), so the output is `./docs`. This no longer
  constrains deployment — the workflow uploads whatever path it is given.
- This site was converted from SCMS. Three URLs the old build published are
  gone on purpose and carry no redirect: `/valentines-entertainment.html`,
  `/event-cash-for-kids - Copy.html` and `/_archive.html`.
- **The site is on its third build.** `_oldsite/` is v1, the hand-written site
  that predates SCMS — five files, kept in the repo as an archive, not part of
  the build and no longer served. v2 was SCMS, tagged `v2.0.0` at the last
  commit before this conversion, with branch `v2` at the same commit. This
  kiss-ssg build is v3, which is what `package.json` says.
