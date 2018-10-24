// AnalogDataReader.jsx

import React from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import { measurementDataType } from '../common/DataTypes'

import DataPointMarker from './DataPointMarker.jsx'
import RulerMarker from './RulerMarker.jsx'
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

    this.dataRectRef = null
  }

  componentDidMount() {
    const { getDataRectRef } = this.props
    // console.log('Mounting AnalogDataReader ...')
    // console.log('componentDidMount - dataRectRef:', getDataRectRef())
    this.dataRectRef = getDataRectRef()
    this.subscribeToMouseEvents()
  }

  componentWillUnmount() {
    // console.log('Unmounting AnalogDataReader ...')
    this.unSubscribeToMouseEvents()
  }

  subscribeToMouseEvents() {
    if (this.dataRectRef) {
      d3.select(this.dataRectRef)
        .on('mouseover', this.showMarkers)
        .on('mouseout', this.clearMarkers)
        .on('mousemove', this.readMarker) // You cannot use the synthetic React event onMouseMove, does not work
    }
  }

  unSubscribeToMouseEvents() {
    if (this.dataRectRef) {
      d3.select(this.dataRectRef)
        .on('mouseover', null)
        .on('mouseout', null)
        .on('mousemove', null) // You cannot use the synthetic React event onMouseMove, does not work
    }
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
    if (this.dataRectRef) {
      // get SVG coordinates of the mouse in the OverlayRect
      let [x, y] = d3.mouse(this.dataRectRef)
      // console.log(`readMarker => x: ${x}  y: ${y}`)
      this.updateMarkerPosition(x, y)
    }
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
      // console.log(
      //   `Updating the marker postion to => time: ${time}  value: ${value}`
      // )
      // update state
      let nextState = Object.assign({}, this.state)
      const [x, y] = [timeScale(time), dataScale(value)]
      nextState.markers.enabled = this.validatePosition(x, y)
      nextState.markers.position = { x, y }
      nextState.markers.prevIndex = index
      this.setState(nextState)
    }
  }

  validatePosition(x, y) {
    const { dataWidth, dataHeight } = this.props

    return (
      !(x === 0 && y === 0) && // position when initialised
      (x >= 0 && y >= 0) &&
      (x < dataWidth && y < dataHeight)
    )
  }

  positionIsValid() {
    const {
      position: { x, y }
    } = this.state.markers

    return this.validatePosition(x, y)
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
    // console.group('Rendering AnalogDataReader ...')
    // console.log(position)
    // console.log(`visible: ${visible}`)
    // console.log(
    //   `enabled: ${enabled} positionIsValid: ${this.positionIsValid()}`
    // )
    // console.groupEnd()
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
  getDataRectRef: PropTypes.func.isRequired,
  valueFormatSpecifier: PropTypes.string,
  timeFormatSpecifier: PropTypes.string
}
