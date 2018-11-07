// randomdata.js

import * as d3 from 'd3'

const getTimeValues = (start, stop, interval) => {
  const dateParser = d3.utcParse('%d-%m-%Y')
  const [fromDate, toDate] = [dateParser(start), dateParser(stop)]
  return d3.utcSeconds(fromDate, toDate, interval)
}

let time = {
  from: '20-11-2015', // UTC Date must be in format DD-mm-YYYY
  to: '21-11-2016', // UTC Date must be in format DD-mm-YYYY
  interval: 15 * 60 // in seconds
}

const analogDomain = {
  time,
  value: {
    min: 20, // minimum analog value
    max: 60 // maximum analog value
  }
}

const discreteDomain = {
  time,
  values: ['NODATA', 'ON', 'OFF']
}

export const discreteColorScale = d => {
  switch (d.value) {
    case 'ON':
      return '#28a745'
    case 'OFF':
      return '#dc3545'
    default:
      return 'none'
  }
}

let timeValues = getTimeValues(
  analogDomain.time.from,
  analogDomain.time.to,
  analogDomain.time.interval
)
// console.log(`timeValues: ${JSON.stringify(timeValues)}`)
// console.log(`Number of timeValues: ${timeValues.length}`)

// analog random data
// function which generates random values between two UTC timestamps for a given interval
export function analogRandomData() {
  const randomVal = d3.randomUniform(
    analogDomain.value.min,
    analogDomain.value.max
  )
  return timeValues.map(v => ({ time: v, value: randomVal() }))
}

export function analogZeroData() {
  return timeValues.map(v => ({ time: v, value: 0 }))
}

export const analogSchema = {
  subsystem: 'TX_CS_635',
  name: 'txmagtempval',
  unit: {
    long: 'degree celsius',
    short: '°C'
  },
  domain: {
    lowerlimit: {
      property: 'txmagtemplowlimitref',
      value: '5.0',
      severity: 'WARNING'
    },
    upperlimit: {
      property: 'txmagtemphighlimitref',
      value: '120.0',
      severity: 'ERROR'
    },
    range: {
      maxValue: '140.0',
      minValue: '0.0'
    }
  },
  type: 'float',
  short: 'Magnetron body temperature'
}

// discrete random data
// function which generates random values between two UTC timestamps for a given a given array of data values
export function discreteRandomData(params) {
  const discreteVal = () => {
    const index = Math.floor(d3.randomUniform(discreteDomain.values.length)())
    return discreteDomain.values[index]
  }
  return timeValues.map(v => ({ time: v, value: discreteVal() }))
}

// function which returns the discrete data domain
export function getDiscreteDataDomain() {
  return discreteDomain.values
}

export const discreteSchema = {
  subsystem: 'basics',
  name: 'radiation',
  domain: {
    defaultseverity: 'UNKNOWN',
    item: [
      {
        severity: 'OK',
        value: 'ON'
      },
      {
        severity: 'WARNING',
        value: 'OFF'
      }
    ]
  },
  type: 'string',
  info: {
    severity: {
      OK: 'Radiation switched on',
      WARNING: 'Radiation switched off'
    }
  },
  short: 'Radiation'
}
