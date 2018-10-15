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
