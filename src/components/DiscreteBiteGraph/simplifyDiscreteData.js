// src/components/DiscreteBiteGraph/simplifyDiscreteData.js

function uniqVals(dataSet) {
  let seen = {}
  let out = []
  const len = dataSet.length
  let j = 0
  for (let i = 0; i < len; i++) {
    let item = dataSet[i].value
    if (seen[item] !== 1) {
      seen[item] = 1
      out[j++] = dataSet[i]
    }
  }
  return out
}

export default function simplifyDiscreteData(data, maxPixelCount = 500) {
  // splits the big 'data' array into equal chunks of smaller arrays
  // Each chunk is then reduced to a new array only containg its
  // unique data Values. Only the first occuring non-unique value
  // is retained
  // Written in plain JS for speed considerations
  const splitLength = Math.ceil(data.length / maxPixelCount) /* ? */
  let simplifiedData = []
  for (let index = 0; index < data.length; index += splitLength) {
    const dataSet = data.slice(index, index + splitLength) /* ? */
    simplifiedData = simplifiedData.concat(uniqVals(dataSet) /*? */)
  }
  return simplifiedData
}
