---
subject-hash: 1afe9b078b68cd21af14e99c54ac806ca5bf1e2e
---

# about.js

Chunks the two people lists into rows of three.

## Why it exists

Under SCMS the about page's people came from two XML files rendered through an
XSLT stylesheet (boxes.xsl, in the old _layouts folder). That stylesheet's one
piece of real logic was an XPath selecting every third box — `position() mod 3
= 1` — plus a for-each pulling in the two following siblings, wrapping each
group in a Bootstrap row. That is a chunk of an array, so it moved here rather
than into the template, and `about/people` became a plain nested `{{#each}}`.

## What to know before changing it

- **`ROW_SIZE` is coupled to the grid classes in the `about/people` partial**
  (`col-sm-6 col-md-4` — three across at `md`). Change one without the other
  and you get a ragged grid, with nothing failing the build.
- **It returns a patch; it must not mutate `model`.** `about.json` is re-read
  on a whole-site rebuild but the resolved object is reused on a scoped one, so
  assigning `steeringRows` onto the model in place would accumulate across
  saves under watch. This is the trap kiss-ssg's own contract warns about for
  object models.
- The commented-out box entries in the old XML were dropped when the model was
  extracted: XSLT never matched a comment, so they were never published, and
  carrying them into JSON would have quietly added people to the page. They are
  still in the SCMS history, in the about page's collective and staff XML files
  under the old _pages tree.
