import React, {useState} from 'react'
import {Button} from "react-bootstrap";
import PropTypes from 'prop-types'
import TaskPrioritySelector from "./TaskPrioritySelector";
import {getAuthenticityToken} from "./shared/helpers";

const IndividualTask = (props) => {
  const priorityOptions = [
    {id: 1, name: 'urgent'},
    {id: 2, name: 'high'},
    {id: 3, name: 'normal'},
    {id: 4, name: 'low'}
  ]

  // const selectedPriority = priorityOptions.find((element) => element.name === props.data.priority).id

  const priorityId = (name) => {
    return priorityOptions.find((element) => element.name === name).id
  }

  const [name, setName] = useState(props.data.name)
  const [description, setDescription] = useState(props.data.description)
  const [completed, setCompleted] = useState(props.data.completed)
  const [priority, setPriority] = useState(priorityId(props.data.priority))
  const [editPressed, setEditPressed] = useState(false)

  const cancelChanges = () => {
    console.log("Cancel Changes")
    console.log(props.data)
    setName(props.data.name)
    setDescription(props.data.description)
    setCompleted(props.data.completed)
    setPriority(priorityId(props.data.priority))
    setEditPressed(false)
  }

  // const updateTask = () => {
  //   setName(props.data.name)
  //   setDescription(props.data.description)
  //   setCompleted(props.data.completed)
  //   setPriority(props.data.priority)
  // }

  const saveChanges = () => {
    console.log("Saved changes")

    console.log("Old data:")
    console.log("name:", props.data.name)
    console.log("description:", props.data.description)
    console.log("completed:", props.data.completed)
    console.log("priority:", props.data.priority)

    console.log("New data:")
    console.log("name:",name)
    console.log("description:", description)
    console.log("completed:", completed)
    console.log("priority:", priority)
    fetch(`/api/user_todo_lists/${props.data.user_todo_list_id}/individual_tasks/${props.data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        individual_task: {
          name: name,
          description: description,
          priority: priority,
          completed: completed,
        }
      }),
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
    .then((response) => {
      if(response.ok){
        props.getTasks()
      }
      else{
        throw new Error('Network response was not OK')
      }
    })
    .catch(error => {
      console.log(error)
    })

    setEditPressed(false)
  }

  return(
    <div className='card'>
      <div className='card-body'>
        {!editPressed &&
          <div className='task'>
            <div className='card-title'>
              <label htmlFor="name">Task Name:</label>
              {name}
            </div>
            <p className='card-text'>
              <label htmlFor="description">Description:</label>
              <br/>
              {description}
            </p>
            <p className='card-text'>
              <label>Completed:</label>
              <input
                className='checkbox-completed'
                type='checkbox'
                disabled={true}
                defaultChecked={completed}
              />
            </p>
            <p className='card-text'>
              <label htmlFor="priority">Priority:</label>
              <TaskPrioritySelector priorities={priorityOptions} setPriority={setPriority} disabled={true} selectedPriority={priority}/>
            </p>
            <button
              className='delete-task-button'
              onClick={() => {props.handleTaskDelete()}
              }>Delete Task</button>
            <button
              className='edit-task-button'
              onClick={() => {
                setEditPressed(true)
              }}
            >Edit
            </button>
          </div>
        }
        {editPressed &&
          <div>
            <div className='card-title'>
              <label htmlFor="name">Name:</label>
              <input
                className='card-title'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <p className='card-text'>
              <label htmlFor="description">Description:</label>
              <textarea
                className='description-input'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </p>
            <p className='card-text'>
              <label>Completed:</label>
              <input
                className='checkbox-completed'
                type='checkbox'
                defaultChecked={completed}
                onChange={(e) => {
                  console.log(completed)
                  setCompleted(!completed)
                  console.log(completed)
                  console.log(e.target.value)
                  // e.target.value==='on' ? setCompleted(true) : setCompleted(false)
                }}
              />
            </p>
            <p className='card-text'>
              <label htmlFor="priority">Priority:</label>
              <TaskPrioritySelector priorities={priorityOptions} setPriority={setPriority} disabled={false} selectedPriority={priority}/>
            </p>
            <Button
              className='edit-task-button-cancel'
              onClick={() => { cancelChanges()}}>Cancel</Button>
            <Button
              className='edit-task-button-save'
              onClick={() => { saveChanges()}}>Save</Button>
          </div>
        }
      </div>

    </div>
  )
}
IndividualTask.propTypes = {
  data: PropTypes.object,
  handleTaskDelete: PropTypes.func,
  getTasks: PropTypes.func
}
export default IndividualTask