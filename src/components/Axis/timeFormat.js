// timeFormat.js
// cusom time formatting for the time ticks of the <TimeAxis/> component
// copied and adapted from https://github.com/d3/d3-time-format

import * as d3 from 'd3'

let formatMillisecond = d3.utcFormat('.%L')
let formatSecond = d3.utcFormat(':%S')
let formatMinute = d3.utcFormat('%H:%M')
// let formatHour = d3.utcFormat('%I %p')
let formatHour = d3.utcFormat('%H')
let formatDay = d3.utcFormat('%a %d')
let formatWeek = d3.utcFormat('%b %d')
// let formatMonth = d3.utcFormat('%B')
let formatMonth = d3.utcFormat('%b')
let formatYear = d3.utcFormat('%Y')

export default function timeFormat(date) {
  return (d3.utcSecond(date) < date
    ? formatMillisecond
    : d3.utcMinute(date) < date
      ? formatSecond
      : d3.utcHour(date) < date
        ? formatMinute
        : d3.utcDay(date) < date
          ? formatHour
          : d3.utcMonth(date) < date
            ? d3.utcWeek(date) < date
              ? formatDay
              : formatWeek
            : d3.utcYear(date) < date
              ? formatMonth
              : formatYear)(date)
}
