import React from 'react'
import PropTypes from "prop-types";

const TaskOptionSelector = (props) => {
  return (
    <select
      autoFocus={props.hasFocus}
      onBlur={() => {
        if(props.hasFocus){
          props.onBlur()
        }
      }}
      className='task-option-selector'
      defaultValue={props.selectedOption}
      onChange={(e) => {
        console.log(e.target.value)
        props.setOption(e.target.value)
      }}
      disabled={props.disabled}>
      {props.options.map((option) => (
        <option key={option.id} value={props.useIdAsValue ? option.id : option.name}>
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
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  useIdAsValue: PropTypes.bool,
  hasFocus: PropTypes.bool,
  onBlur: PropTypes.func
}

export default TaskOptionSelector