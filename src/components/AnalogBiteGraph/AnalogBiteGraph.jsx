// AnalogBiteGraph.jsx

import React from 'react'
import PropTypes from 'prop-types'

import { createTimeScale, createAnalogScale } from '../common/biteGraphScales'
import ClipPath from '../common/ClipPath.jsx'
import TimeAxis from '../Axis/TimeAxis.jsx'
import DataAxis from '../Axis/DataAxis.jsx'
import YAxisLegend from '../Axis/YAxisLegend.jsx'
import AnalogDataLayer from './AnalogDataLayer.jsx'
import DataReader from './AnalogDataReader.jsx'
import { measurementDataType } from '../common/DataTypes'
import { styles, dataHeight, dataWidth } from '../common/biteGraphStyles'

import { withZoom } from '../common/Zoomable.jsx'

export function AnalogBiteGraph(props) {
  const { data, zoomtransform, datareader, transition, svgRef } = props
  const {
    width,
    height,
    padding: {
      left: paddingLeft,
      right: paddingRight,
      top: paddingTop,
      bottom: paddingBottom
    }
  } = styles
  const initialTimeScale = createTimeScale(data, dataWidth)
  const dataScale = createAnalogScale(data, dataHeight)
  // apply a zoom transform to the timescale if present
  const timeScale = zoomtransform
    ? zoomtransform.rescaleX(initialTimeScale)
    : initialTimeScale

  return (
    <svg
      className="BiteGraph analog"
      width="100%"
      height="100%"
      viewBox={`-${paddingLeft} -${paddingTop} ${width} ${height}`}
      ref={svgRef}
    >
      <ClipPath
        width={dataWidth}
        height={dataHeight}
        id="BiteGraph-analog-clippath"
      />
      <TimeAxis scale={timeScale} dataHeight={dataHeight} />
      <DataAxis scale={dataScale} />
      <YAxisLegend y={-paddingLeft} dy="1.5em" text="Analog Random Data" />
      <AnalogDataLayer
        timeScale={timeScale}
        dataScale={dataScale}
        data={data}
        transition={transition}
        clipPathId="BiteGraph-analog-clippath"
      />
      {datareader && (
        <DataReader
          type="analog"
          timeScale={timeScale}
          dataScale={dataScale}
          data={data}
          dataWidth={dataWidth}
          dataHeight={dataHeight}
        />
      )}
    </svg>
  )
}

AnalogBiteGraph.defaultProps = {
  zoomtransform: null,
  datareader: true,
  transition: true,
  svgRef: () => {}
}

AnalogBiteGraph.propTypes = {
  data: PropTypes.arrayOf(measurementDataType).isRequired,
  zoomtransform: PropTypes.object, //d3 zoom transform object
  datareader: PropTypes.bool,
  transition: PropTypes.bool,
  svgRef: PropTypes.func // used by Parent components to retrieve the dom node of the BiteGraph SVG
}

export default withZoom(AnalogBiteGraph)
