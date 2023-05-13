import React from 'react'
import PropTypes from "prop-types";

const TaskPrioritySelector = (props) => {
  return (
    <select onChange={(e) => props.setPriority(e.target.value)}>
      {props.priorities.map((priority) => (
        <option key={priority.id} value={priority.id}>
          {priority.name}
        </option>
      ))}
    </select>
  )
}

TaskPrioritySelector.propTypes = {
  priorities: PropTypes.array,
  setPriority: PropTypes.func
}

export default TaskPrioritySelector