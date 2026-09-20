// Handlebars' default escaping is for text nodes, so it turns `=` into `&#x3D;`
// — harmless but unreadable once a URL with a query string moves out of a
// template and into router.js or a model. This escapes what actually has to be
// escaped inside an attribute and leaves the rest alone.
export const escapeAttrUrl = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export function registerUrlHelper(kiss) {
  kiss.handlebars.registerHelper(
    'url',
    (value) => new kiss.handlebars.SafeString(escapeAttrUrl(value)),
  )
}
