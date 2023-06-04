import React from "react"
import PropTypes from "prop-types";

const Loader = (props) => {
  return (
    <div className={props.smallLoader ? 'small-loader' : 'loader'}>
      <span></span>
    </div>
  )
}

Loader.propTypes = {
  smallLoader: PropTypes.bool
}

export default Loader