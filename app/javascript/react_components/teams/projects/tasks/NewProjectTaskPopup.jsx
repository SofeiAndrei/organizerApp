import React, {useState} from 'react'
import PropTypes from "prop-types";

import { Modal, Button} from 'react-bootstrap'
import TaskOptionSelector from "../../../TaskOptionSelector";
import {getAuthenticityToken} from "../../../shared/helpers";
import {formatDate} from "../../../shared/calendar_helper";

const NewProjectTaskPopup = (props) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState('normal')
  const [deadline, setDeadline] = useState(formatDate(new Date()))
  const [status, setStatus] = useState('backlog')

  const handleModalClose = () => {
    props.setNewProjectTaskModalOpen(false)
  }

  const priorityOptions = [
    {id: 1, name: 'urgent'},
    {id: 2, name: 'high'},
    {id: 3, name: 'normal'},
    {id: 4, name: 'low'}
  ]

  const statusOptions = [
    {id: 1, name: 'backlog'},
    {id: 2, name: 'selected_for_development'},
    {id: 3, name: 'in_progress'},
    {id: 4, name: 'testing'},
    {id: 5, name: 'completed'}
  ]

  const resetForm = () => {
    console.log("I reset the form")
    setName('')
    setDescription('')
    setPriority('normal')
    setStatus('backlog')
  }

  const onSave = () => {
    console.log("SAVED???")
    console.log(props.teamProject)
    fetch(`/teams/${props.teamProject.team_id}/team_projects/${props.teamProject.id}/team_project_tasks`, {
      method: 'POST',
      body: JSON.stringify({
        team_project_task: {
          name: name,
          description: description,
          priority: priority,
          deadline: deadline,
          status: status,
          creator_id: props.currentUserId,
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
    <Modal show={props.newProjectTaskModalOpen} onHide={() => handleModalClose()} animation={false}>
      <Modal.Header>
        <Modal.Title>
          Create a New Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='content'>
          <div>
            <label htmlFor="name">Name:</label>
            <input className='form-control' type='text' id='name' value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea className='description-input form-control' id='description' value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="priority">Priority:</label>
            <TaskOptionSelector options={priorityOptions} setOption={setPriority} selectedOption={priority} useIdAsValue={false}/>
          </div>
          <div>
            <label htmlFor='deadline'>Deadline:</label>
            <input
              className='form-control'
              type='date'
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='status'>Status:</label>
            <TaskOptionSelector options={statusOptions} setOption={setStatus} selectedOption={status} useIdAsValue={false}/>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn btn-primary button-dark' onClick={() => handleModalClose()}>Cancel</Button>
        <Button className='btn btn-primary button-dark' onClick={() => onSave()}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}
NewProjectTaskPopup.propTypes = {
  newProjectTaskModalOpen: PropTypes.bool,
  setNewProjectTaskModalOpen: PropTypes.func,
  teamProject: PropTypes.object,
  getTasks: PropTypes.func,
  currentUserId: PropTypes.number
}

export default NewProjectTaskPopup