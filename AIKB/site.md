# swanlove.co.uk

## What this site is and who for

An eleven-page brochure site for Swan Love, a Leeds events collective that runs
charity music nights. The audience is people deciding whether to come to an
event, plus sponsors and performers deciding whether to work with them. Most
pages are static copy; the two that carry data are the about page (the steering
group and the collective) and the sponsors page.

The content is largely frozen — the most recent event page counts down to April
2017 — so the ordinary change here is a copy edit or a new person, not a new
feature. Treat it as a site to keep working, not one under development.

## How it is deployed

GitHub Pages, serving the `./docs` folder of the default branch, at
www.swanlove.co.uk via the CNAME file in the assets folder.

The build output is committed, because that is what Pages reads. There is no
CI: whoever changes the source runs `npm run build` and commits the result
alongside it. A source change committed without its rebuilt output does nothing
to the live site — that is the single most likely way to be confused here.

Pages defaults its publishing folder to the repository root, so the docs folder
had to be selected by hand. If the site ever serves the old SCMS pages again,
or 404s everywhere, check that setting first.

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
  construction, so the output is `./docs` and cannot be the repository root
  however Pages is configured.
- **`npm run dev` builds into a scratch folder, not `./docs`.** Dev output
  carries a livereload shim, expanded CSS and no analytics, and the atomic
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
