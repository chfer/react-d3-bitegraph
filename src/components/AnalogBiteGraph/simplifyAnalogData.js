// src/components/AnalogBiteGraph/simplifyAnalogData.js

function minData(dataSet) {
  let min = dataSet[0]
  for (let i = 1; i < dataSet.length; i++) {
    if (dataSet[i].value < min.value) {
      min = dataSet[i]
    }
  }
  return min
}

function maxData(dataSet) {
  let max = dataSet[0]
  for (let i = 1; i < dataSet.length; i++) {
    if (dataSet[i].value > max.value) {
      max = dataSet[i]
    }
  }
  return max
}

export default function simplifyAnalogData(data, maxPixelCount = 500) {
  // splits the big 'data' array into equal chunks of smaller arrays
  // Each chunk is then reduced to a new array only containg its
  // minimum and maximum. Only the first occuring min/max values
  // are retained
  // Written in plain JS for speed considerations
  const splitLength = Math.ceil(data.length / maxPixelCount)
  const simplifiedData = []
  for (let index = 0; index < data.length; index += splitLength) {
    const dataSet = data.slice(index, index + splitLength)
    const [min, max] = [minData(dataSet), maxData(dataSet)]
    if (min.time > max.time) {
      simplifiedData.push(max, min)
    } else if (min.time < max.time) {
      simplifiedData.push(min, max)
    } else {
      // min and max are both the same
      simplifiedData.push(min)
    }
  }
  return simplifiedData
}
