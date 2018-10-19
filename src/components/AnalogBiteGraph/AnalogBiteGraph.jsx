// src/components/AnalogBiteGraph/AnalogBiteGraph.jsx

import React from 'react'
import PropTypes from 'prop-types'

import { createTimeScale, createAnalogScale } from '../common/biteGraphScales'
import ClipPath from '../common/ClipPath.jsx'
import TimeAxis from '../Axis/TimeAxis.jsx'
import DataAxis from '../Axis/DataAxis.jsx'
import YAxisLegend from '../Axis/YAxisLegend.jsx'
import AnalogDataLayer from './AnalogDataLayer.jsx'
import DataReader from './AnalogDataReader.jsx'
import Stats from '../common/Stats.jsx'
import AnalogStatValues from './AnalogStatValues.jsx'
import { measurementDataType } from '../common/DataTypes'
import { styles, dataHeight, dataWidth } from '../common/biteGraphStyles'

import { withZoom } from '../common/Zoomable.jsx'

export function AnalogBiteGraph(props) {
  const {
    data,
    stateName,
    unit,
    zoomTransform,
    dataReader,
    transition,
    svgRef
  } = props
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
  const timeScale = zoomTransform
    ? zoomTransform.rescaleX(initialTimeScale)
    : initialTimeScale
  // console.log(`unit: ${JSON.stringify(unit)}`)
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
      <YAxisLegend
        y={-paddingLeft}
        dy="1.5em"
        text={`${stateName.short} (${unit.short})`}
      />
      <AnalogDataLayer
        timeScale={timeScale}
        dataScale={dataScale}
        data={data}
        transition={transition}
        clipPathId="BiteGraph-analog-clippath"
      />
      {dataReader && (
        <DataReader
          type="analog"
          timeScale={timeScale}
          dataScale={dataScale}
          data={data}
          dataWidth={dataWidth}
          dataHeight={dataHeight}
          unit={unit.short}
        />
      )}
      <Stats
        data={data}
        dataWidth={dataWidth}
        timeScale={timeScale}
        position={{ y: -paddingTop }}
        renderStatValues={(data, position) => (
          <AnalogStatValues data={data} unit={unit.short} position={position} />
        )}
      />
    </svg>
  )
}

AnalogBiteGraph.defaultProps = {
  zoomTransform: null,
  dataReader: true,
  transition: true,
  svgRef: () => {}
}

AnalogBiteGraph.propTypes = {
  data: PropTypes.arrayOf(measurementDataType).isRequired,
  stateName: PropTypes.shape({
    short: PropTypes.string,
    long: PropTypes.string
  }),
  unit: PropTypes.shape({
    short: PropTypes.string,
    long: PropTypes.string
  }),
  zoomTransform: PropTypes.object, //d3 zoom transform object
  dataReader: PropTypes.bool,
  transition: PropTypes.bool,
  svgRef: PropTypes.func // used by Parent components to retrieve the dom node of the BiteGraph SVG
}

export default withZoom(AnalogBiteGraph)
