# swanlove.co.uk

## What this site is and who for

An eleven-page brochure site for Swan Love, a Leeds events collective that ran
charity music nights. The audience is people deciding whether to come to an
event, plus sponsors and performers deciding whether to work with them. Most
pages are static copy; the two that carry data are the about page (the steering
group and the collective) and the sponsors page.

The content is largely frozen — the most recent event page counts down to April
2017 — so the ordinary change here is a copy edit or a new person, not a new
feature. Treat it as a site to keep working, not one under development.

## Three builds, and which is which

| | Build | Where it lives |
| --- | --- | --- |
| v1 | hand-written HTML, before any generator | `_oldsite/` in this repo, five files, archived and not served |
| v2 | SCMS — ERB layouts, one folder per page, output committed to the repository root | tag `v2.0.0`, branch `v2` |
| v3 | kiss-ssg — this build | `master`, once the conversion merged |

`package.json` carries the current number, so a fourth build renames nothing
else.

## How it is deployed

GitHub Pages, from a workflow rather than from a branch: every push to master
runs the build in Actions and uploads the build folder as the Pages artifact.
Pull requests run the same build and check without publishing.

The build output is **not** committed — CI produces it. This is the second
deployment shape the site has had: the conversion first committed the output
and pointed Pages at a folder of the branch, which meant a source change
committed without its rebuilt output silently did nothing to the live site.
Building in CI removes that failure mode, and with it the churn from the
sitemap's build-time timestamps.

One setting carries it and is not visible in the repository: Pages must have
GitHub Actions selected as its source.

The site is served at its default Pages address. It ran on the custom domain
swanlove.co.uk until that registration expired; the domain was removed from
the Pages settings, the CNAME file was deleted, and `siteUrl` in the build
script was repointed. That one value is what every canonical URL, sitemap
entry and the robots file's sitemap line are built from, so moving domains
again is that line plus a rebuild — with the scheme kept as https, since a
github.io address is HTTPS-only and an http one would name a redirect
everywhere.

## Conventions

They are stated for contributors in `CLAUDE.md`; the durable reasoning:

- **Internal URLs are never written by hand** — `{{link}}` for pages,
  `{{asset}}` for files. The point is not tidiness: the SCMS site had
  accumulated a link to a page whose source had been deleted, three
  document-relative image paths, and two hrefs missing their scheme, none of
  which anything could have caught. Now a rename fails the build.
- **Repeated content is a model.** The sponsor list was ten hand-copied blocks
  of markup and had already drifted — a missing separator, an unclosed tag. It
  is a JSON model plus one partial now, and drift is not expressible.
- **`router.js` answers "what pages does this site have."** Nothing else should
  need reading to find out.
- **Custom helpers live beside the build script, not under the source folder.**
  That is the kiss-ssg convention, and it is also the placement that fails
  honestly: the engine watches the source folder, so a helper kept there makes
  a dev edit produce a rebuild and a live reload while still serving the old
  helper. Kept outside, the edit visibly does nothing, which is the truth. The
  kiss-ssg maintainers measured both halves of this from this site's report and
  are documenting the convention because of it.

## Standing gotchas

- **The build folder cannot contain the source folder.** kiss-ssg refuses it at
  construction, so the output is `./docs`. This constrained deployment only
  while Pages read a folder of the branch; the workflow uploads whatever path
  it is given, so it is now just where the build lands.
- **A dev server cannot pick up an edit to the build script or to a helper.**
  Under `npm run dev`, editing `router.js` — to add a page, say — logs a change
  and a rebuild, fires live reload, and does not build the new page: the
  rebuild replays the registrations it already cached. Editing a file under
  the helpers folder behaves the same way, because a module already imported is
  not imported again. Both were measured on 2.4.0 by the kiss-ssg maintainers,
  who are making the rebuild say so rather than making the edit take effect.
  Restart the dev server after touching either.
- **`npm run dev` builds into a scratch folder, not `./docs`.** Dev output
  carries a livereload shim and expanded CSS, and the atomic
  clean degrades to a plain clean under dev. Pointing dev at the published
  folder leaves a preview build there — it happened once during the conversion
  and was caught only by grepping the output for the livereload shim.
- **Stylesheets are the sass sources, and a compiled sibling silently wins.**
  The SCMS repo committed both the sass and its compiled CSS side by side;
  kiss-ssg compiles sass itself, so the compiled siblings were deleted. Do not
  re-add one. This was first recorded here as the two "racing", which is wrong:
  kiss-ssg compiles every sass file and then copies everything else over the
  top, so the plain CSS always wins, every time, with no warning and a build
  that still reports success. Measured on 2.4.0 by the kiss-ssg maintainers
  from this site's report: a sass file and a CSS file of the same name produced
  the CSS file's bytes, and the build report listed only one asset, so the
  collision is invisible rather than merely unwarned. If the deleted files ever
  come back, every sass edit stops reaching the site and nothing says so.
- **Attribute URLs from config or a model need the `url` helper.** Handlebars'
  default escaping is for text nodes and turns an equals sign into a numeric
  entity inside a query string. Renders fine, reads like a bug.
- **The old SCMS output is gone, including three URLs with no redirect:** the
  stale valentines-entertainment page, an accidental "Copy" duplicate of the
  cash-for-kids page, and an _archive scratch page. Deliberate — the first was
  a duplicate of the real valentines event page, the other two were never real
  pages.

## Retired feedback

- *"Publish from the repository root like SCMS did, so no Pages setting has to
  change."* Not possible: the build folder may not contain the source folder.
  Moot in any case — a workflow deployment reads no folder of the branch, and
  changing the Pages source is a one-off either way.
- *"holder.js is tiny, leave it."* Removed. It is Bootstrap's placeholder-image
  library, carried over from the example template this design came from, and it
  was loaded on all ten inner pages while nothing on the site ever asked for a
  placeholder.
- *"Leave the IE8 shims in, they only load for old browsers."* Removed. The
  conditional comment they sat in is itself an IE-only feature that no browser
  since IE10 has honoured, so the scripts could only ever have run in browsers
  that no longer exist. The local copies of both had already been dead for
  years — the layouts pointed at a CDN, never at them.
- *"Keep the Google Analytics snippet, it is only a few lines."* Removed. It
  was a Universal Analytics property, and Google shut that product down in
  2023, so it was loading a third-party script on every page to report to
  somewhere that stopped listening. Any future measurement starts from a
  current product, not from reviving this.
- *"Commit the build output so the deployed site is visible in the
  repository."* What the conversion did first. It made every rebuild a diff of
  its own, mostly the sitemap's timestamps, and made a forgotten rebuild a
  silent non-deployment. CI builds it instead.
