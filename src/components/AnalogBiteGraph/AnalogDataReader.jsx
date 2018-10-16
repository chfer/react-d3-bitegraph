// AnalogDataReader.jsx

import React from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import { measurementDataType } from '../common/DataTypes'

import DataPointMarker from './DataPointMarker.jsx'
import RulerMarker from './RulerMarker.jsx'
import OverlayRect from '../common/OverlayRect.jsx'
import DataTooltip from '../common/DataTooltip.jsx'

export default class AnalogDataReader extends React.Component {
  constructor(props) {
    super(props)
    // console.log(`AnalogDataReader constructor execution ...`)
    this.state = {
      markers: {
        enabled: false,
        position: {
          // x y position of the pointer of the read data in SVG coordinates
          x: 0,
          y: 0
        },
        prevIndex: -1 // previous index of the read data
      }
    }

    this.clearMarkers = this.clearMarkers.bind(this)
    this.showMarkers = this.showMarkers.bind(this)
    this.readMarker = this.readMarker.bind(this)

    // Define bisector functions for x
    this.bisectDate = d3.bisector(entry => entry.time).left

    // Define data formatters
    this.valueFormat = d3.format(props.valueFormatSpecifier)
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
    // disable all markers (datapoint + dataruler) and make them dissapear
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
    let [x, y] = d3.mouse(this.refs.dataReaderAnalog)
    // console.log(`readMarker => x: ${x}  y: ${y}`)
    this.updateMarkerPosition(x, y)
  }

  updateMarkerPosition(x, y) {
    let { timeScale, dataScale, data } = this.props
    let { prevIndex } = this.state.markers

    let pointedDate = timeScale.invert(x) // date pointed to by mouse
    // console.log(
    //   `pointedDate: ${pointedDate} pointedValue: ${dataScale.invert(y)}`
    // )
    let index = this.bisectDate(data, pointedDate)
    // console.log(`uncorrected index: ${index}`)
    if (index < 0) {
      index = 0
    } else if (index > data.length - 1) {
      index = data.length - 1
    }
    if (index >= 1) {
      let leftDate = data[index - 1]['time'] // datapoint left from pointedDate
      let rightDate = data[index]['time'] // datapoint right from pointedDate
      if (pointedDate - leftDate <= rightDate - pointedDate) {
        index--
      }
    }
    // console.log(`index: ${index} prevIndex: ${prevIndex}`)
    // Only update update the marker position if the index has changed
    // otherwise the rendering is unnecessary and only takes resources
    if (index !== prevIndex) {
      // determine X and Y of the datapoint at that index
      let { time, value } = data[index]
      // console.log(`time: ${time}  value: ${value}`)
      // update state
      let nextState = Object.assign({}, this.state)
      nextState.markers.position = {
        x: timeScale(time),
        y: dataScale(value)
      }
      nextState.markers.prevIndex = index
      this.setState(nextState)
    }
  }

  positionIsValid() {
    const {
      position: { x, y }
    } = this.state.markers
    const { dataWidth, dataHeight } = this.props

    return (
      !(x === 0 && y === 0) && // position when initialised
      (x >= 0 && y >= 0) &&
      (x < dataWidth && y < dataHeight)
    )
  }

  render() {
    const { position, enabled, prevIndex } = this.state.markers
    const { data, dataWidth, dataHeight, unit } = this.props
    // console.log(`markers: ${JSON.stringify(this.state.markers, null, 2)}`)
    let [timeStr, valueStr] = ['', '']
    if (prevIndex >= 0 && prevIndex < data.length) {
      timeStr = this.timeFormat(data[prevIndex].time)
      valueStr = `${this.valueFormat(data[prevIndex].value)} ${unit}`
    }
    const visible = enabled && this.positionIsValid()

    return (
      <g className="DataReader analog" ref="dataReaderAnalog">
        <DataPointMarker position={position} visible={visible} />
        <RulerMarker
          dataHeight={dataHeight}
          position={position}
          visible={visible}
        />
        <DataTooltip
          textLines={[timeStr, valueStr]}
          position={position}
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

AnalogDataReader.defaultProps = {
  valueFormatSpecifier: '.1f',
  timeFormatSpecifier: '%a %d-%m-%Y %H:%M:%S'
}

AnalogDataReader.propTypes = {
  timeScale: PropTypes.func.isRequired,
  dataScale: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(measurementDataType).isRequired,
  dataWidth: PropTypes.number.isRequired,
  dataHeight: PropTypes.number.isRequired,
  unit: PropTypes.string,
  valueFormatSpecifier: PropTypes.string,
  timeFormatSpecifier: PropTypes.string
}
