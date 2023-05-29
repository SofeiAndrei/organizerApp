import React, {useState} from 'react'
import {Button} from "react-bootstrap";
import PropTypes from 'prop-types'
import TaskOptionSelector from "../TaskOptionSelector";
import {getAuthenticityToken} from "../shared/helpers";
import AddTagPopup from "../AddTagPopup";
import {formatDate} from "../shared/calendar_helper";

const IndividualTask = (props) => {
  const priorityOptions = [
    {id: 1, name: 'urgent'},
    {id: 2, name: 'high'},
    {id: 3, name: 'normal'},
    {id: 4, name: 'low'}
  ]

  const priorityId = (name) => {
    return priorityOptions.find((element) => element.name === name).id
  }

  const [name, setName] = useState(props.data.task.name)
  const [description, setDescription] = useState(props.data.task.description)
  const [completed, setCompleted] = useState(props.data.task.completed)
  const [priority, setPriority] = useState(priorityId(props.data.task.priority))
  const [deadline, setDeadline] = useState(props.data.task.deadline ||= formatDate(new Date()))
  const [tags, setTags] = useState(props.data.tags)

  const notSetTags = props.listTags.filter(tag => !tags.includes(tag))
  notSetTags.unshift({id: 0, name: 'New Tag'})
  console.log(notSetTags)

  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState(notSetTags)

  const [editPressed, setEditPressed] = useState(false)

  const [loading, setLoading] = useState(false)

  const cancelChanges = () => {
    console.log("Cancel Changes")
    console.log(props.data)
    setName(props.data.task.name)
    setDescription(props.data.task.description)
    setCompleted(props.data.task.completed)
    setPriority(priorityId(props.data.task.priority))
    setTags(props.data.tags)
    setEditPressed(false)
  }

  const onTagDelete = (tag) => {
    console.log("Remove tag from task")
    const newTags = tags.filter((filteredTag) => filteredTag.id !== tag.id)
    setTags(newTags)
    console.log("Add the tag to available tags")
    const newAvailableTags = [...availableTags, tag]
    setAvailableTags(newAvailableTags)
  }

  const saveChanges = () => {
    console.log("Saved changes")

    console.log("Old data:")
    console.log("name:", props.data.task.name)
    console.log("description:", props.data.task.description)
    console.log("completed:", props.data.task.completed)
    console.log("priority:", props.data.task.priority)
    console.log("Tags:", props.data.tags)

    console.log("New data:")
    console.log("name:", name)
    console.log("description:", description)
    console.log("completed:", completed)
    console.log("priority:", priority)
    console.log("Tags:", tags)
    fetch(`/api/user_todo_lists/${props.data.task.user_todo_list_id}/individual_tasks/${props.data.task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        individual_task: {
          name: name,
          description: description,
          priority: priority,
          completed: completed,
          deadline: deadline,
          tags: tags,
        },
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

  console.log('TAGS:', tags)
  return(
    <div className='card'>
      <div className='card-body'>
        {!editPressed &&
          <div className='task'>
            <div className='card-title'>
              {name}
            </div>
            <p className='card-text'>
              <label htmlFor="description">Description:</label>
              <br/>
              {description}
            </p>
            <div className='card-text'>
              <div className='tags-container'>
                <div className='content-tags'>
                  {!loading && tags.map((tag) =>
                    <div key={tag.id} className='tag-row'>
                      <div className='tag-text-container'>
                        <div className='text'>
                          {tag.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className='card-text'>
              <label htmlFor="priority">Priority:</label>
              <TaskOptionSelector options={priorityOptions} setOption={setPriority} disabled={true} selectedOption={priority}/>
            </p>
            <p className='card-text'>
              <label htmlFor='deadline'>Deadline:</label>
              {deadline}
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
            <div className='card-text'>
              <div className='tags-container'>
                <div className='content-tags'>
                  {!loading && tags.map((tag, index) =>
                    <div key={index} className='tag-row'>
                      <div className='tag-text-container'>
                        <div className='text'>
                          {tag.name}
                        </div>
                      </div>
                      <a type='button' className='delete-tag-button' onClick={() => onTagDelete(tag)}>
                        x
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className='add-tag'>
              <a
                className='add-tag-button'
                onClick={() => setTagModalOpen(true)}>
                <span>Add</span>
              </a>
            </span>
            <p className='card-text'>
              <label htmlFor="priority">Priority:</label>
              <TaskOptionSelector options={priorityOptions} setOptions={setPriority} disabled={false} selectedOption={priority}/>
            </p>
            <p className='card-text'>
              <label htmlFor='deadline'>Deadline:</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
                }}
              />
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
      <AddTagPopup
        tagModalOpen={tagModalOpen}
        setTagModalOpen={setTagModalOpen}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
        tags={tags}
        setTags={setTags}
        todoListId={props.data.task.user_todo_list_id}
        setLoading={setLoading}
      />
    </div>
  )
}
IndividualTask.propTypes = {
  data: PropTypes.object,
  handleTaskDelete: PropTypes.func,
  getTasks: PropTypes.func,
  listTags: PropTypes.array
}
export default IndividualTask