// Every custom helper this site adds to the ones kiss ships, composed into the
// single registerHelpers(kiss) that router.js calls.
import { registerUrlHelper } from './url.js'

export function registerHelpers(kiss) {
  registerUrlHelper(kiss)
  return kiss
}
