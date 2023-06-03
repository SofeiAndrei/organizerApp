import React from 'react'
import PropTypes from "prop-types";

const TagSelector = (props) => {
  console.log("Available tags", props.availableTags)
  return (
    <select
      className='tag-selector form-control'
      defaultValue={props.selectedTag.id}
      onChange={(e) => {
        console.log(e.target.value)
        console.log(props.availableTags[e.target.value])
        props.setSelectedTag(props.availableTags[e.target.value])
      }}>
      {props.availableTags.map((tag, index) => (
        <option key={tag.id} value={index}>
          {tag.name}
        </option>
      ))}
    </select>
  )
}

TagSelector.propTypes = {
  availableTags: PropTypes.array,
  selectedTag: PropTypes.object,
  setSelectedTag: PropTypes.func
}

export default TagSelector