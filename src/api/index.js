// src/index.js
import R from 'ramda'
import parse from 'date-fns/parse'

const isoToDate = R.evolve({
  time: parse
})
export const getBiteData = R.compose(
  R.map(isoToDate),
  R.path(['data', 'request', 'result'])
)
export const getBiteSchema = R.path(['data', 'request', 'schema'])
export const getDiscreteDomain = R.compose(
  R.ifElse(
    R.isNil,
    R.always([]),
    R.compose(
      R.prepend('NODATA'),
      R.map(R.prop('value'))
    )
  ),
  R.path(['domain', 'item']),
  getBiteSchema
)
export const getStateName = R.compose(
  R.zipObj(['short', 'long']),
  R.values,
  R.pick(['name', 'short']),
  getBiteSchema
)
export const getUnit = R.compose(
  R.prop('unit'),
  getBiteSchema
)

// Functions to create a colorscale for a discrete BITE dataset
// Only three levels seems to be present in all schema's: 'OK', 'WARNING' and 'ERROR'
// May a fourth level appear in the future, this will not lead to a bug but will
// generate the color '#007bff'
const biteColors = {
  OK: '#28a745',
  WARNING: '#fd7e14',
  ERROR: '#dc3545'
}
const getBiteColor = R.compose(
  R.ifElse(R.isNil, R.always('#007bff'), R.identity),
  R.prop(R.__, biteColors)
)
const makeSingleColorEntry = R.compose(
  R.apply(R.objOf),
  R.reverse,
  R.values,
  R.evolve({ severity: getBiteColor })
)
const makeBiteColorEntries = R.compose(
  R.mergeAll,
  R.map(makeSingleColorEntry),
  R.path(['domain', 'item']),
  getBiteSchema
)
export const makeDiscreteColorScale = discreteResponse => {
  const baseEntries = makeBiteColorEntries(discreteResponse)
  return R.compose(
    R.ifElse(R.isNil, R.always('none'), R.identity),
    R.prop(R.__, baseEntries),
    R.prop('value')
  )
}
