import React from 'react'
import PropTypes from "prop-types";

const TaskPrioritySelector = (props) => {
  console.log(props.selectedPriority)
  return (
    <select
      defaultValue={props.selectedPriority}
      onChange={(e) => {
        console.log(e.target.value)
        props.setPriority(e.target.value)
      }}
      disabled={props.disabled}>
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
  setPriority: PropTypes.func,
  disabled: PropTypes.bool,
  selectedPriority: PropTypes.number
}

export default TaskPrioritySelector