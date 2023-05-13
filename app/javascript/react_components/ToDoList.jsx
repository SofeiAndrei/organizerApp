import React, { useState }from 'react'
import { getAuthenticityToken } from "./shared/helpers";
import PropTypes from 'prop-types'

const ToDoList = ({todoList}) => {
  // const [name, setName] = useState(todoList.name)

  const handleListDelete = () => {
    console.log(window.parent)
    console.log(window.location)
    if (confirm(`Are you sure you want to delete ${todoList.name}? This record will be permanently deleted.`)){
      fetch(`${todoList.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
        .then((response) => {
          console.log(`Deleted ${todoList.name} To Do List`)
          window.location.replace(response.url)
        })
    }
  }

	return (
		<div>
			{todoList.name}
      <br/>
      <button
        className='btn btn-primary btn-danger'
        onClick={() => {handleListDelete()}}
      >
        Delete
      </button>
		</div>
	)
}
ToDoList.propTypes = {
	todoList: PropTypes.object
}
export default ToDoList