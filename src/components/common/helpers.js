// src/components/common/helpers.js
// Here comes a collection of helper functions
import * as d3 from 'd3'
import * as R from 'ramda'
import parse from 'date-fns/parse'

// Define bisector functions for the Time
export const bisectTimeLeft = d3.bisector(entry => entry.time).left
export const bisectTimeRight = d3.bisector(entry => entry.time).right

// define a clamp function for a given data index
export const clamp = (index, dataCount) => R.clamp(0, dataCount, index)

// determine whether the data is discrete or analog
// if the 'value' of the first element is a 'String' it is considered discrete
export const isDiscreteData = R.compose(
  R.equals('String'),
  R.type,
  R.prop('value'),
  R.head
)

export function getVisibleDataSlice(
  data,
  dataWidth,
  timeScale,
  indexMargin = 0
) {
  const [timeAxisStart, timeAxisEnd] = [
    timeScale.invert(0),
    timeScale.invert(dataWidth)
  ]
  // determine start and end index of the time Axis
  const [indexStart, indexEnd] = [
    clamp(bisectTimeRight(data, timeAxisStart) - indexMargin, data.length),
    clamp(bisectTimeRight(data, timeAxisEnd) - 1 + indexMargin, data.length)
  ]
  // console.log(`indexStart: ${indexStart} indexEnd: ${indexEnd}`)
  const visibleData = data.slice(indexStart, indexEnd + 1) // indexEnd must be included => slice to indexEnd + 1

  return {
    timeAxisStart, // the start time of the visible data Axis
    timeAxisEnd, // the end time of the visible data Axis
    indexStart, // the start index of the vis // the start time of the visible data Axisible data slice
    indexEnd, // the end index of the visible data slice
    visibleData //the slice of the original "data" array which will be visible for the given timeScale and over the given dataWidth
  }
}
