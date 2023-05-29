import React, {useEffect, useState} from 'react'
import PropTypes from "prop-types";

import { Modal, Button} from 'react-bootstrap'
import TaskOptionSelector from "../../../TaskOptionSelector";

const ViewProjectTaskPopup = (props) => {
  if(props.viewProjectTaskModalOpen) {
    const [name, setName] = useState(props.data.task.name)
    const [description, setDescription] = useState(props.data.task.description)
    const [priority, setPriority] = useState(props.data.task.priority)
    const [deadline, setDeadline] = useState(props.data.task.deadline)
    const [status, setStatus] = useState(props.data.task.status)

    const [assigneeId, setAssigneeId] = useState(props.data.task.assignee_id ||= 0)

    const [tempName, setTempName] = useState(name)
    const [tempDescription, setTempDescription] = useState(description)

    const [editingName, setEditingName] = useState(false)
    const [editingDescription, setEditingDescription] = useState(false)
    const [editingAssignee, setEditingAssignee] = useState(false)
    const [editingPriority, setEditingPriority] = useState(false)
    const [editingDeadline, setEditingDeadline] = useState(false)
    const [editingStatus, setEditingStatus] = useState(false)

    const teamMemberOptions = [
      {id: 0, name: 'Unassigned'},
      ...props.teamMembers
    ]

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

    const handleModalClose = () => {
      props.setViewProjectTaskModalOpen(false)
    }

    const changesHaveBeenMade = () => {
      console.log(props.data.task.assignee_id)
      console.log(
        (props.data.task.assignee_id === null && assigneeId !== 0),
        (props.data.task.assignee_id !== null && assigneeId !== props.data.task.assignee_id)
      )
      return name !== props.data.task.name ||
        description !== props.data.task.description ||
        priority !== props.data.task.priority ||
        deadline !== props.data.task.deadline ||
        status !== props.data.task.status ||
        props.data.task.assignee_id !== parseInt(assigneeId)
    }

    const cancelNameChanges = (event) => {
      if (event.relatedTarget.innerText === 'Save'){
        saveNameChanges()
      }
      setTempName(name)
      setEditingName(false)
    }
    const saveNameChanges = () => {
      setEditingName(false)
      setName(tempName)
    }
    const cancelDescriptionChanges = (event) => {
      if (event.relatedTarget.innerText === 'Save'){
        saveDescriptionChanges()
      }
      setTempDescription(description)
      setEditingDescription(false)
    }
    const saveDescriptionChanges = () => {
      setEditingDescription(false)
      setDescription(tempDescription)
    }

    const SaveChanges = () => {
      const task = {
        id: props.data.task.id,
        name: name,
        description: description,
        priority: priority,
        deadline: deadline,
        status: status,
        assignee_id: assigneeId
      }
      props.updateTask(task)
      handleModalClose()
    }

    return (
      <Modal show={props.viewProjectTaskModalOpen} onHide={() => handleModalClose()} animation={false}>
        <Modal.Header>
          <Modal.Title>
            {editingName ? (
              <div>
                <textarea id='name' value={tempName} onChange={(e) => setTempName(e.target.value)} autoFocus onBlur={cancelNameChanges}/>
                <button className='btn' onClick={cancelNameChanges}>{'Cancel'}</button>
                <button className='btn' onClick={saveNameChanges}>{'Save'}</button>
              </div>
            ) : (
              <p onClick={() => setEditingName(true)}>{name}</p>
            )
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='content'>
            <div className='description-container'>
              <label>{'Description'}</label>
              {editingDescription ? (
                <div>
                  <textarea id='description' placeholder='Add a description...' value={tempDescription} onChange={(e) => setTempDescription(e.target.value)} autoFocus onBlur={cancelDescriptionChanges}/>
                  <button className='btn' onClick={cancelDescriptionChanges}>{'Cancel'}</button>
                  <button className='btn' onClick={saveDescriptionChanges}>{'Save'}</button>
                </div>
              ) : (
                <p onClick={() => setEditingDescription(true)}>{description ? description : 'Add a description...'}</p>
              )
              }
            </div>
            <div className='assignee-container'>
              <label>{'Assignee'}</label>
              {editingAssignee ? (
                <div>
                  <div>
                    <TaskOptionSelector options={teamMemberOptions} setOption={setAssigneeId} selectedOption={assigneeId} useIdAsValue={true} hasFocus={true} onBlur={() => setEditingAssignee(false)}/>
                  </div>
                </div>
              ) : (
                <p onClick={() => setEditingAssignee(true)}>{teamMemberOptions.filter(member => (assigneeId ? member.id === parseInt(assigneeId) : member.id === assigneeId))[0].name}</p>
              )
              }
              {props.currentUserId !== assigneeId &&
                <a onClick={() => setAssigneeId(props.currentUserId)}>Assign to me</a>
              }

            </div>
            <div className='priority-container'>
              <label>{'Priority'}</label>
              {editingPriority ? (
                <div>
                  <div>
                    <TaskOptionSelector options={priorityOptions} setOption={setPriority} selectedOption={priority} useIdAsValue={false} hasFocus={true} onBlur={() => setEditingPriority(false)}/>
                  </div>
                </div>
              ) : (
                <p onClick={() => setEditingPriority(true)}>{priority}</p>
              )
              }
            </div>
            <div className='deadline-container'>
              <label>{'Deadline'}</label>
              {editingDeadline ? (
                <div>
                  <div>
                    <input
                      autoFocus
                      type="date"
                      value={deadline}
                      onBlur={() => setEditingDeadline(false)}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <p onClick={() => setEditingDeadline(true)}>{deadline}</p>
              )
              }
            </div>
            <div className='status-container'>
              <label>{'Status'}</label>
              {editingStatus ? (
                <div>
                  <div>
                    <TaskOptionSelector options={statusOptions} setOption={setStatus} selectedOption={status} useIdAsValue={false} hasFocus={true} onBlur={() => setEditingStatus(false)}/>
                  </div>
                </div>
              ) : (
                <p onClick={() => setEditingStatus(true)}>{status}</p>
              )
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {(props.userIsTeamAdmin || props.currentUserId === props.data.task.creator_id) && (
            <Button className='btn btn-danger' onClick={() => {
              handleModalClose()
              props.handleTaskDelete(props.data.task)
            }}>Delete</Button>
          )}
          <Button onClick={() => handleModalClose()}>Cancel</Button>
          <Button className={changesHaveBeenMade() ? '' : 'hidden'} onClick={SaveChanges}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

ViewProjectTaskPopup.propTypes = {
  viewProjectTaskModalOpen: PropTypes.bool,
  setViewProjectTaskModalOpen: PropTypes.func,
  data: PropTypes.object,
  teamMembers: PropTypes.array,
  updateTask: PropTypes.func,
  handleTaskDelete: PropTypes.func,
  userIsTeamAdmin: PropTypes.bool,
  currentUserId: PropTypes.number
}

export default ViewProjectTaskPopup