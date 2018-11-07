// src/components/AnalogBiteGraph/AnalogBiteGraph.jsx

import React from 'react'
import PropTypes from 'prop-types'

import { getVisibleDataSlice, simplifyAnalogData } from '../common/helpers'
import { createTimeScale, createAnalogScale } from '../common/biteGraphScales'
import DataAreaRect from '../common/DataAreaRect.jsx'
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
    zoombaseRef
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
  let { visibleData } = getVisibleDataSlice(data, dataWidth, timeScale, 10)
  console.log(`visible data slice: ${visibleData.length} points ...`)
  const MAXPIXELCOUNT = 500
  if (visibleData.length > MAXPIXELCOUNT) {
    // simplify the data
    visibleData = simplifyAnalogData(visibleData, MAXPIXELCOUNT)
    console.log(`Simplified the data to ${visibleData.length} points ...`)
  }
  // console.log(`unit: ${JSON.stringify(unit)}`)
  // Define a reference to an overlay rectangle which contains the data area of the graph
  // this overlay rectangle will capture mouse events for the DataReader component and zoom
  let dataAreaRectRef = null
  console.log(`zoomTransform: ${JSON.stringify(zoomTransform)}`)
  return (
    <svg
      className="BiteGraph analog"
      width="100%"
      height="100%"
      viewBox={`-${paddingLeft} -${paddingTop} ${width} ${height}`}
    >
      {/* render a Data rectangle which will define the (data-)area where mouse events will be captured for data reading, zooming and panning*/}
      <DataAreaRect
        width={dataWidth}
        height={dataHeight}
        dataAreaRectRef={el => {
          zoombaseRef(el)
          dataAreaRectRef = el
        }}
      />
      <TimeAxis scale={timeScale} dataHeight={dataHeight} />
      <DataAxis scale={dataScale} />
      <YAxisLegend
        y={-paddingLeft}
        dy="1.5em"
        text={`${stateName.short} (${unit.short})`}
      />
      <ClipPath
        width={dataWidth}
        height={dataHeight}
        id="BiteGraph-analog-clippath"
      />
      <AnalogDataLayer
        timeScale={timeScale}
        dataScale={dataScale}
        data={visibleData}
        clipPathId="BiteGraph-analog-clippath"
      />
      {dataReader && (
        <DataReader
          type="analog"
          timeScale={timeScale}
          dataScale={dataScale}
          data={visibleData}
          dataWidth={dataWidth}
          dataHeight={dataHeight}
          unit={unit.short}
          getDataRectRef={() => dataAreaRectRef}
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
  dataReader: true
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
  zoombaseRef: PropTypes.func // used by Parent components to retrieve the dom node of the BiteGraph <DataAreaRect />
}

// export default AnalogBiteGraph
export default withZoom(AnalogBiteGraph)
