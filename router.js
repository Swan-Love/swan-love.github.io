// The build script. It replaces SCMS's _config.yml plus the eleven
// _pages/<slug>/_config.yml files: what pages this site has, what each one is
// called and where its data comes from is now answerable by reading one file.
//
//   npm run build   one-shot build into ./docs (what GitHub Pages serves)
//   npm run dev     the same build with a live-reloading server on :3001
//   npm run check   dry-run build; reports page diffs and broken links
import Kiss from 'kiss-ssg'
import { registerHelpers } from './helpers/index.js'

const dev = process.argv.includes('--dev')

// Facts the site states more than once. They were repeated across the two ERB
// layouts and several page views before; stated here they reach every template
// as {{config.site.…}} and change in one place.
const site = {
  name: 'Swan Love',
  tagline: 'A creative collective of talented artists, musicians and performers',
  copyrightYear: 2014,
  contactForm: 'https://swanlove.wufoo.com/forms/z1u277000phlf3s/',
  ticketsUrl: 'http://www.wegottickets.com/event/346185',
  newsletterUrl: 'http://eepurl.com/L6cKb',
  gaProperty: 'UA-47032634-1',
  gaDomain: 'swanlove.co.uk',
  social: [
    { name: 'Facebook', href: 'https://www.facebook.com/SwanLoveEvents' },
    { name: 'Twitter', href: 'https://twitter.com/SwanLoveEvents' },
    {
      name: 'LinkedIn',
      href: 'http://www.linkedin.com/groups?gid=6522019&trk=my_groups-b-grp-v',
    },
  ],
  footerSponsors: [
    { name: 'iTutor Ltd', href: 'http://www.ipassexam.com' },
    { name: 'Ignite Pyrotechnics Ltd', href: 'http://www.ignitepyro.com' },
  ],
}

// Internal entries name a page by id and are resolved by {{link}}, so
// renaming a page breaks the build here rather than shipping a dead nav link.
const nav = [
  { page: 'events-royalgeorgethornbury', label: 'Next Event' },
  {
    href: 'http://www.skiddle.com/whats-on/Leeds/White-Cloth-Gallery/Swan-Love-/12642666/',
    label: 'Tickets',
    external: true,
  },
  {
    href: 'https://www.dropbox.com/sc/lok0amcsfz1bkom/AADPIfuAYOWULT-obFA0eOvua',
    label: 'Gallery',
    external: true,
  },
  { page: 'charity', label: 'Charity' },
  { page: 'sponsors', label: 'Sponsors' },
  { page: 'about', label: 'About Us' },
]

const kiss = new Kiss({
  site,
  nav,
  siteUrl: 'http://www.swanlove.co.uk',
  folders: {
    // GitHub Pages serves this branch's /docs folder. Assets land beside the
    // pages — src/assets/css/layout.scss becomes docs/css/layout.css — so
    // every URL the old SCMS build published still resolves.
    //
    // A dev run builds somewhere else and is git-ignored: dev output carries a
    // livereload shim, expanded CSS and no analytics, and `atomic` degrades to
    // a plain clean in dev, so pointing `npm run dev` at ./docs would leave the
    // published folder holding a preview build.
    build: dev ? './.kiss-dev' : './docs',
  },
  // The published folder is never half-written: the build stages elsewhere and
  // is swapped in only once complete() resolves.
  cleanBuild: 'atomic',
  dev,
})

// Registered after construction and before anything renders, which is where
// kiss-ssg's own examples put it.
registerHelpers(kiss)

kiss
  .page({
    view: 'index.hbs',
    title: 'Swan Love Events',
    description: site.tagline,
  })
  .page({
    view: 'about.hbs',
    title: 'About Swan Love Events',
    description:
      'Swan Love is a creative collective of talented artists, musicians and performers',
    model: 'about.json',
    controller: 'about.js',
  })
  .page({
    view: 'charity.hbs',
    title: 'Swan Love Event Charities',
    description:
      'Swan Love is working with some amazing charities, read all about them here',
  })
  .page({
    view: 'sponsors.hbs',
    title: 'Swan Love Events Sponsors',
    description: 'Swanlove would like to thank all our sponsors',
    model: 'sponsors.json',
  })
  .page({
    view: 'gallery.hbs',
    title: 'Swan Love Events Gallery',
    description:
      "Elegant, beautiful events made with Yorkshire's most gifted and talented performers",
  })
  .page({
    view: 'donate.hbs',
    title: 'Donate to Swan Love Event Charities',
    description: 'Give a reason to support our charities',
  })
  .page({
    view: 'corporate.hbs',
    title: 'Swan Love Events',
    description: 'Swan Love for corporate clients',
    // Placeholder copy, exactly as it was under SCMS. It stays out of the
    // sitemap until it says something.
    ignoreSitemap: true,
  })

  // The four event pages differ only in their heading, their countdown date
  // and their running order. The first three live here; the running order is
  // the page's own .hbs.
  .page({
    view: 'events-royalgeorgethornbury.hbs',
    title: 'Swan Love @ the Royal George',
    description: 'Swan Love at The Royal George, Thornbury — Good Friday',
    model: { countdown: { heading: 'Good Friday', at: '04/14/2017 19:00:00' } },
  })
  .page({
    view: 'event-cash-for-kids.hbs',
    title: 'Swan Love - Cash for Kids',
    description: 'Swan Love with Radio Aire and Cash for Kids',
    model: {
      countdown: { heading: 'Cash for Kids', at: '02/19/2016 19:00:00' },
    },
  })
  .page({
    view: 'event-mean-streets.hbs',
    title: 'Swan Love - Mean Streets',
    description: "Mean Streets, for the homeless charity Simon on the Streets",
    model: { countdown: { heading: 'Mean Streets', at: '06/13/2014 19:00:00' } },
  })
  .page({
    view: 'event-valentines-entertainment.hbs',
    title: 'Swan Love - Valentines Entertainment',
    description: "Valentine's Entertainment for Hand in Hand for Syria",
    model: {
      countdown: {
        heading: "Valentine's Entertainment",
        at: '02/14/2014 19:00:00',
      },
    },
  })

  .generate()
  .sitemap()
  .robots()

if (!dev) {
  await kiss.complete().catch((err) => {
    console.error(err.message)
    for (const failure of err.failures ?? []) {
      console.error(` - ${failure.view}: ${failure.error}`)
    }
    process.exitCode = 1
  })
}
