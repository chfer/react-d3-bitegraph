// DiscreteDataLayer.jsx

import React from 'react'

import './DiscreteDataLayer.css'

const DiscreteDataLayer = ({timeScale, dataScale, data, dataWidth, baseVal}) => {
  // console.log(`Rendering Discrete dataLayer ...`)
  let statusRects = data.map((entry, index, data) => {
    let x = timeScale(entry.time)
    let y = dataScale(entry.value)
    let height = dataScale(baseVal) - y
    let width = 5 // width in data units given to the last rect
    if (index < (data.length - 1)) {
      width = timeScale(data[index + 1].time) - x
    }
    return (<rect className={`status ${entry.value}`} x={x} y={y} width={width} height={height} key={`statusData-${index}`}/>)
  })

  return (
    <g className="dataLayer discrete">
      {statusRects}
    </g>
  )
}

const statusDataType = React.PropTypes.shape({
  time: React.PropTypes.instanceOf(Date).isRequired,
  value: React.PropTypes.string.isRequired
})

DiscreteDataLayer.propTypes = {
  timeScale: React.PropTypes.func.isRequired,
  dataScale: React.PropTypes.func.isRequired,
  data: React.PropTypes.arrayOf(statusDataType).isRequired,
  dataWidth: React.PropTypes.number.isRequired,
  baseVal: React.PropTypes.string.isRequired
}

export default DiscreteDataLayer
