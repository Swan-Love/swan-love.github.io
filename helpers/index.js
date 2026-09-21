// Every custom helper this site adds to the ones kiss ships, composed into the
// single registerHelpers(kiss) export that kiss-ssg loads and calls itself
// (config.folders.helpers, default ./helpers) — router.js has no line for it.
import { registerUrlHelper } from './url.js'

export function registerHelpers(kiss) {
  registerUrlHelper(kiss)
  return kiss
}
