import React, { useState, useEffect }from 'react'
import { getAuthenticityToken, callAPI } from "../shared/helpers";
import PropTypes from 'prop-types'
import IndividualTask from "./IndividualTask";
import NewIndividualTaskPopup from "./NewIndividualTaskPopup";
import Loader from "../Loader";

const ToDoList = (props) => {
  const [tasks, setTasks] = useState([])
  const [dataIsLoading, setDataIsLoading] = useState(true)
  const [newTaskFormModalOpen, setNewTaskFormModalOpen] = useState(false)

  const getTasks = () => {
    callAPI(`/api/user_todo_lists/${props.todoList.id}/get_tasks`, 'GET')
      .then((json) => {
        console.log(json.tasks)
        console.log("got tasks")
        setTasks(json.tasks)
        setTimeout(() => setDataIsLoading(false), 1000)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleListDelete = () => {
    if (confirm(`Are you sure you want to delete ${props.todoList.name}? This record will be permanently deleted.`)){
      fetch(`${props.todoList.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
      .then((response) => {
        console.log(`Deleted ${props.todoList.name} To Do List`)
        window.location.replace(response.url)
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  const handleTaskDelete = (deletedTask) => {
    if (confirm(`Are you sure you want to delete ${deletedTask.name}? This task will be permanently deleted.`)){
      fetch(`/api/user_todo_lists/${props.todoList.id}/individual_tasks/${deletedTask.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
      .then((response) => {
        const newTasks = tasks.filter((task) => task.task.id !== deletedTask.id)
        setTasks(newTasks)
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  useEffect(getTasks, [])

	return (
    <div className='todo-list jumbotron'>
      <h1>
        {props.todoList.name}
      </h1>
      <div className='d-flex justify-content-between'>
        <button className='btn btn-primary button-dark'
                onClick={() => {setNewTaskFormModalOpen(true)}}>
          Create new Task
        </button>
        {' '}
        <a className='btn btn-primary button-dark' href={`${props.todoList.id}/edit`}>Edit List</a>
        {' '}
        <button
          className='btn btn-primary btn-primary button-dark-red'
          onClick={() => {handleListDelete()}}
        >Delete</button>
      </div>
      { !dataIsLoading ? (
        <div>
          <div className='todolist_tasks'>
            {tasks.map((individualTask) =>
              <IndividualTask key={individualTask.task.id} data={individualTask} handleTaskDelete={() => handleTaskDelete(individualTask.task)} getTasks={getTasks} listTags={props.listTags}/>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Loader smallLoader={false}/>
        </div>
      )}
      <NewIndividualTaskPopup
        newTaskFormModalOpen={newTaskFormModalOpen}
        setNewTaskFormModalOpen={setNewTaskFormModalOpen}
        tasks={tasks}
        setTasks={setTasks}
        todoList={props.todoList}
        getTasks={getTasks}
      />
    </div>
	)
}
ToDoList.propTypes = {
	todoList: PropTypes.object,
  listTags: PropTypes.array,
}
export default ToDoList