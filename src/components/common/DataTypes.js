// Datatypes.js

import React from 'react'
import PropTypes from 'prop-types'

export const measurementDataType = PropTypes.shape({
  time: PropTypes.instanceOf(Date).isRequired,
  value: PropTypes.number.isRequired
})

export const statusDataType = PropTypes.shape({
  time: PropTypes.instanceOf(Date).isRequired,
  value: PropTypes.string.isRequired
})
