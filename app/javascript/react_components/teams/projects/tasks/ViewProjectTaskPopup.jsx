import React, {useEffect, useState} from 'react'
import PropTypes from "prop-types";

import { Modal, Button} from 'react-bootstrap'
import TaskOptionSelector from "../../../TaskOptionSelector";
import {callAPI, getAuthenticityToken} from "../../../shared/helpers";
import {formatWords} from "../../../shared/formater_helper";
import Loader from "../../../Loader";

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

    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [commentsLoading, setCommentsLoading] = useState(true)

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
      setCommentsLoading(true)
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

    const saveNewComment = (content, writerId, taskId) => {
      fetch(`/api/task_comments`, {
        method: 'POST',
        body: JSON.stringify({
          task_comment: {
            content: content,
            writer_id: writerId,
            team_project_task_id: taskId
          }
        }),
        headers: {
          'X-CSRF-Token': getAuthenticityToken(),
          'Content-Type': "application/json"
        }})
        .then((response) => {
          if(response.ok){
            getTaskComments()
          }
          else{
            throw new Error('Network response was not OK')
          }
        })
        .catch(error => {
          console.log(error)
        })

    }

    const getTaskComments = () => {
      callAPI(`/api/task_comments/${props.data.task.id}`, 'GET')
        .then((json) => {
          console.log(json.comments)
          console.log("got task comments")
          setComments(json.comments)
          setTimeout(() => setCommentsLoading(false), 500)
        })
        .catch(error => {
          console.log(error)
        })
    }

    const handleCommentPosted = () => {
      console.log("Written comment:", comment)
      console.log("Call to create a comment with the text:", comment, " the creator_id:", props.currentUserId, " and the task_id:", props.data.task.id)
      setComment('')
      setCommentsLoading(true)
      saveNewComment(comment, props.currentUserId, props.data.task.id)
    }

    const handleCommentDelete = (commentId) => {
      setCommentsLoading(true)
      if (confirm(`Are you sure you want to delete this comment?`)){
        fetch(`/api/task_comments/${commentId}`, {
          method: 'DELETE',
          headers: {'X-CSRF-Token': getAuthenticityToken()}})
          .then(() => {
            getTaskComments()
          })
          .catch(error => {
            console.log(error)
          })
      }
    }

    useEffect(() => getTaskComments(), [props.data])

    return (
      <Modal dialogClassName='team_project_task_view_modal' show={props.viewProjectTaskModalOpen} onHide={() => handleModalClose()} animation={false}>
        <Modal.Header>
          <Modal.Title>
            {editingName ? (
              <div>
                <textarea className='form-control' id='name' value={tempName} onChange={(e) => setTempName(e.target.value)} autoFocus onBlur={cancelNameChanges}/>
                <button className='btn btn-primary button-dark' onClick={cancelNameChanges}>{'Cancel'}</button>
                <button className='btn btn-primary button-dark' onClick={saveNameChanges}>{'Save'}</button>
              </div>
            ) : (
              <p onClick={() => setEditingName(true)}>{name}</p>
            )
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className='row'>
              <div className='col-xs-12 col-sm-7 col-md-7 col-lg-7 col-xl-7 team-project-task-comments-container'>
                <div className='team-project-task-comments'>
                  <input className='form-control' type='text' placeholder='Add a comment...' onChange={(e) => setComment(e.target.value)} value={comment}/>
                  <button className={comment === '' ? 'hidden ' : '' + 'btn btn-primary button-dark'} onClick={handleCommentPosted}>Send</button>
                  {!commentsLoading ? (
                    <div>
                    {comments.map(comment => (
                      <div key={comment.id} className={'comment' + (comment.writer_id === props.currentUserId ? ' align-items-end' : '')}>
                        <a className='comment-writer' href={`/users/${comment.writer.id}`}>{comment.writer.name}</a>
                        <div className='comment-content'>{comment.content}</div>
                        <div className='comment-created_at-time'>{(new Date(comment.created_at)).toString()}</div>
                        <button className='btn btn-xs btn-primary delete-comment-button button-dark-red' onClick={() => handleCommentDelete(comment.id)}>x</button>
                      </div>
                    ))}
                    </div>
                  ) : (
                    <Loader smallLoader={true}/>
                  )}
                </div>
              </div>
              <div className='col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5 team-project-task-info'>
                <div className='description-container'>
                  <label>{'Description'}</label>
                  {editingDescription ? (
                    <div>
                      <textarea className='form-control' id='description' placeholder='Add a description...' value={tempDescription} onChange={(e) => setTempDescription(e.target.value)} autoFocus onBlur={cancelDescriptionChanges}/>
                      <button className='btn btn-primary button-dark' onClick={cancelDescriptionChanges}>{'Cancel'}</button>
                      <button className='btn btn-primary button-dark' onClick={saveDescriptionChanges}>{'Save'}</button>
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
                    <p onClick={() => setEditingPriority(true)}>{formatWords(priority, false)}</p>
                  )
                  }
                </div>
                <div className='deadline-container'>
                  <label>{'Deadline'}</label>
                  {editingDeadline ? (
                    <div>
                      <div>
                        <input
                          className='form-control'
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
                    <p onClick={() => setEditingStatus(true)}>{formatWords(status, false)}</p>
                  )
                  }
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {(props.userIsTeamAdmin || props.currentUserId === props.data.task.creator_id) && (
            <Button className='btn btn-primary button-dark-red' onClick={() => {
              handleModalClose()
              props.handleTaskDelete(props.data.task)
            }}>Delete</Button>
          )}
          <Button className='btn btn-primary button-dark' onClick={() => handleModalClose()}>Cancel</Button>
          <Button className={(changesHaveBeenMade() ? '' : 'hidden ') + 'btn btn-primary button-dark'} onClick={SaveChanges}>Save</Button>
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