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

## Standing gotchas

- **The build folder cannot contain the source folder.** kiss-ssg refuses it at
  construction, so the output is `./docs`. This constrained deployment only
  while Pages read a folder of the branch; the workflow uploads whatever path
  it is given, so it is now just where the build lands.
- **`npm run dev` builds into a scratch folder, not `./docs`.** Dev output
  carries a livereload shim and expanded CSS, and the atomic
  clean degrades to a plain clean under dev. Pointing dev at the published
  folder leaves a preview build there — it happened once during the conversion
  and was caught only by grepping the output for the livereload shim.
- **Stylesheets are the sass sources.** The SCMS repo committed both the sass
  and its compiled CSS side by side; kiss-ssg compiles sass itself, so the
  compiled siblings were deleted. Re-adding one gives you two sources of truth
  racing to write the same output path.
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
