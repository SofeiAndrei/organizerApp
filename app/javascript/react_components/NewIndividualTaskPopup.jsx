import React, {useState} from 'react'
import PropTypes from "prop-types";

import { Modal, Button} from 'react-bootstrap'
import TaskPrioritySelector from "./TaskPrioritySelector";
import {getAuthenticityToken} from "./shared/helpers";

const NewIndividualTaskPopup = (props) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(3)

  const handleModalClose = () => {
    props.setNewTaskFormModalOpen(false)
  }

  const priorityOptions = [
    {id: 1, name: 'urgent'},
    {id: 2, name: 'high'},
    {id: 3, name: 'normal'},
    {id: 4, name: 'low'}
  ]

  const resetForm = () => {
    console.log("I reset the form")
    setName('')
    setDescription('')
    setPriority(3)
  }
  const onSave = () => {
    // const individual_task = {
    //   name: name,
    //   description: description,
    //   priority: priority,
    //   completed: false,
    // }
    console.log("SAVED???")
    console.log(props.todoList)
    fetch(`/api/user_todo_lists/${props.todoList.id}/individual_tasks`, {
      method: 'POST',
      body: JSON.stringify({
        individual_task: {
          name: name,
          description: description,
          priority: priority,
          completed: false,
        }
      }),
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
    .then((response) => {
      if(response.ok){
        props.getTasks()
        resetForm()
      }
      else{
        throw new Error('Network response was not OK')
      }
    })
    .catch(error => {
      console.log(error)
    })
    handleModalClose()
  }

  return (
    <Modal show={props.newTaskFormModalOpen} onHide={() => handleModalClose()} animation={false}>
      <Modal.Header>
        <Modal.Title>
          Create a New Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='content'>
          <div>
            <label htmlFor="name">Name:</label>
            <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input type='text' id='description' value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="priority">Priority:</label>
            <TaskPrioritySelector priorities={priorityOptions} setPriority={setPriority} selectedPriority={priority}/>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => handleModalClose()}>Cancel</Button>
        <Button onClick={() => onSave()}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}
NewIndividualTaskPopup.propTypes = {
  newTaskFormModalOpen: PropTypes.bool,
  setNewTaskFormModalOpen: PropTypes.func,
  tasks: PropTypes.array,
  setTasks: PropTypes.func,
  todoList: PropTypes.object,
  getTasks: PropTypes.func
}

export default NewIndividualTaskPopup