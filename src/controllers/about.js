// Replaces _layouts/boxes.xsl. The old XSLT selected every third <box> and
// pulled its two following siblings into a Bootstrap .row; the same shape is
// a chunk of the array, so it belongs in the controller and the template gets
// to be a plain nested {{#each}}.
const ROW_SIZE = 3

const inRows = (people = [], size = ROW_SIZE) => {
  const rows = []
  for (let i = 0; i < people.length; i += size) {
    rows.push(people.slice(i, i + size))
  }
  return rows
}

// A patch, never a mutation: src/models/about.json is re-read on a whole-site
// rebuild but the resolved object is reused on a scoped one, so adding keys in
// place would accumulate across saves under `watch`.
export default ({ model }) => ({
  model: {
    ...model,
    steeringRows: inRows(model.steering),
    collectiveRows: inRows(model.collective),
  },
})
