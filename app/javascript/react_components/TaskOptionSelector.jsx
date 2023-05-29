import React from 'react'
import PropTypes from "prop-types";

const TaskOptionSelector = (props) => {
  return (
    <select
      className='task-option-selector'
      defaultValue={props.selectedOption}
      onChange={(e) => {
        console.log(e.target.value)
        props.setOption(e.target.value)
      }}
      disabled={props.disabled}>
      {props.options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  )
}

TaskOptionSelector.propTypes = {
  options: PropTypes.array,
  setOption: PropTypes.func,
  disabled: PropTypes.bool,
  selectedOption: PropTypes.number
}

export default TaskOptionSelector