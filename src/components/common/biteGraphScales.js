// src/components/common/biteGraphScales.js

import * as d3 from 'd3'

export function createTimeScale(data, dataWidth) {
  // create a time scale

  // get the domain of the time values
  let timeExtent = d3.extent(data, i => i.time)
  // console.log(`timeExtent: ${timeExtent}`)

  // Create and return a time scale for converting the x-scale timestamps into pixel values
  return d3
    .scaleUtc()
    .range([0, dataWidth])
    .domain(timeExtent)
    .nice()
}

export function createAnalogScale(data, dataHeight) {
  // Create an analog scale

  // get the domain of the data values
  let dataExtent = d3.extent(data, i => i.value)
  dataExtent[0] = 0
  // console.log(`dataExtent: ${dataExtent}`)

  // Create and return a data scale for converting the y-scale values into pixel values
  return d3
    .scaleLinear()
    .range([dataHeight, 0])
    .domain(dataExtent)
    .nice()
}

export function createDiscreteScale(domain, dataHeight) {
  // Create discrete scales

  // height scale
  return d3
    .scalePoint()
    .range([dataHeight, 0])
    .domain(domain)
    .padding(0)
}
