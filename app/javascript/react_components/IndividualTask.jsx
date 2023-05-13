import React from 'react'
import PropTypes from 'prop-types'

const IndividualTask = (props) => {
  return(
    <div>
      {props.data.name}
      <button
        className='delete-task-button'
        onClick={() => {props.handleTaskDelete()}
      }>Delete Task</button>
    </div>
  )
}
IndividualTask.propTypes = {
  data: PropTypes.object,
  handleTaskDelete: PropTypes.func
}
export default IndividualTask