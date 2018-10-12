// DataReader.jsx

import React from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import { measurementDataType, statusDataType } from '../common/DataTypes'

import StatusMarker from './StatusMarker.jsx'
import OverlayRect from '../common/OverlayRect.jsx'
import DataTooltip from '../common/DataTooltip.jsx'
import DiscreteDataLayer from './DiscreteDataLayer.jsx'

export default class DataReader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      markers: {
        enabled: false,
        position: {
          // x y position of the read data in SVG coordinates
          x: 0,
          y: 0
        },
        nextX: 0, // x value of the next datapoint
        prevIndex: -1 // previous index of the read data
      }
    }

    this.clearMarkers = this.clearMarkers.bind(this)
    this.showMarkers = this.showMarkers.bind(this)
    this.readMarker = this.readMarker.bind(this)

    // Define bisector functions for x
    this.bisectDate = d3.bisector(entry => entry.time).left

    // Define a time formatters
    this.timeFormat = d3.utcFormat(props.timeFormatSpecifier)
  }

  componentDidMount() {
    d3.select(this.overlayRect.refs.rect)
      .on('mouseover', this.showMarkers)
      .on('mouseout', this.clearMarkers)
      .on('mousemove', this.readMarker) // You cannot use the synthetic React event onMouseMove, does not work
  }

  clearMarkers() {
    // console.log('Clear markers ...')
    // make all markers (datapoint + dataruler) dissapear
    let nextState = Object.assign({}, this.state)
    nextState.markers.enabled = false
    this.setState(nextState)
  }

  showMarkers() {
    // console.log('Show markers ...')
    // enable all markers (datapoint + dataruler) and make them visible if there is data to show
    // Initialize previous index
    let nextState = Object.assign({}, this.state)
    nextState.markers.enabled = true
    nextState.markers.prevIndex = -1
    this.setState(nextState)
  }

  readMarker() {
    // get SVG coordinates of the mouse in the OverlayRect
    let [x, y] = d3.mouse(this.refs.dataReader)
    // console.log(`x: ${x}  y: ${y}`)
    this.updateMarkerPosition(x, y)
  }

  updateMarkerPosition(x, y) {
    let { timeScale, dataScale, data } = this.props
    let { prevIndex } = this.state.markers

    let pointedDate = timeScale.invert(x) // date pointed to by mouse
    // console.log(`pointedDate: ${pointedDate} pointedValue: ${dataScale.invert(y)}`)
    let index = this.bisectDate(data, pointedDate)
    // console.log(`uncorrected index: ${index}`)
    if (index < 0) {
      index = 0
    } else if (index > data.length - 1) {
      index = data.length - 1
    } else if (index >= 1) {
      // take the datapoint (Date) left from pointedDate
      index--
    }
    // console.log(`index: ${index} prevIndex: ${prevIndex}`)
    // Only update update the marker position if the index has changed
    // otherwise the rendering is unnecessary and only takes resources
    if (index !== prevIndex) {
      // determine X and Y of the datapoint at that index
      let { time, value } = data[index]
      let nextTime = index === data.length - 1 ? time : data[index + 1].time
      // console.log(`time: ${time}  value: ${value} nextTime: ${nextTime}`)
      // update state
      let nextState = Object.assign({}, this.state)
      nextState.markers.position = {
        x: timeScale(time),
        y: dataScale(value)
      }
      // If we deal with the last datapoint add the width of the last status rect
      nextState.markers.nextX =
        timeScale(nextTime) +
        (index === data.length - 1 ? DiscreteDataLayer.lastStatusRectwidth : 0)
      nextState.markers.prevIndex = index
      this.setState(nextState)
    }
  }

  positionIsValid() {
    const {
      position: { x, y },
      nextX
    } = this.state.markers
    const { dataWidth, dataHeight } = this.props
    return nextX > 0 && y >= 0 && (x < dataWidth && y < dataHeight)
  }

  render() {
    const { position, enabled, nextX, prevIndex } = this.state.markers
    const { data, dataWidth, dataHeight } = this.props
    // console.log(`markers: ${JSON.stringify(this.state.markers, null, 2)}`)
    const clamp = (number, min, max) => Math.min(Math.max(number, min), max)
    let tooltipPosition = {
      x: clamp(position.x + (nextX - position.x) / 2, 0, dataWidth),
      y: position.y
    }
    let [timeStr, valueStr] = ['', '']
    if (prevIndex >= 0 && prevIndex < data.length) {
      timeStr = this.timeFormat(data[prevIndex].time)
      valueStr = data[prevIndex].value
    }

    const visible = enabled && this.positionIsValid()

    return (
      <g className={`DataReader discrete`} ref="dataReader">
        <StatusMarker
          position={position}
          width={nextX - position.x}
          height={dataHeight - position.y}
          visible={visible}
        />
        <DataTooltip
          textLines={[timeStr, valueStr]}
          position={tooltipPosition}
          visible={visible}
        />
        {/* <OverlayRect/> must be last, otherwise the event capture will stop when the mouse is on components that are drawn on top of the <OverlayRect/> */}
        <OverlayRect
          width={dataWidth}
          height={dataHeight}
          ref={input => {
            this.overlayRect = input
          }}
        />
      </g>
    )
  }
}

DataReader.defaultProps = {
  valueFormatSpecifier: '.1f',
  timeFormatSpecifier: '%a %d-%m-%Y %H:%M:%S'
}

DataReader.propTypes = {
  timeScale: PropTypes.func.isRequired,
  dataScale: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(measurementDataType),
    PropTypes.arrayOf(statusDataType)
  ]).isRequired,
  dataWidth: PropTypes.number.isRequired,
  dataHeight: PropTypes.number.isRequired,
  timeFormatSpecifier: PropTypes.string
}
