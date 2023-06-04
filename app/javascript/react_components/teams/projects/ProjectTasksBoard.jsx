import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {callAPI, getAuthenticityToken} from "../../shared/helpers";
import NewProjectTaskPopup from "./tasks/NewProjectTaskPopup";
import ProjectTasksBoardKanban from "./ProjectTasksBoardKanban";
import ViewProjectTaskPopup from "./tasks/ViewProjectTaskPopup";
import Loader from "../../Loader";

const ProjectTasksBoard = (props) => {
  const [tasks, setTasks] = useState([])
  const [dataIsLoading, setDataIsLoading] = useState(true)
  const [newProjectTaskModalOpen, setNewProjectTaskModalOpen] = useState(false)
  const [viewProjectTaskModalOpen, setViewProjectTaskModalOpen] = useState(false)
  const [selectedTaskData, setSelectedTaskData] = useState({})

  const getTasks = () => {
    callAPI(`/api/team_projects/${props.teamProject.id}/get_project_tasks`, 'GET')
      .then((json) => {
        console.log(json.tasks)
        console.log("got project tasks")
        setTasks(json.tasks)
        setTimeout(() => setDataIsLoading(false), 500)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const updateTask = (task) => {
    fetch(`/teams/${props.teamProject.team_id}/team_projects/${props.teamProject.id}/team_project_tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        team_project_task: {
          name: task.name,
          description: task.description,
          priority: task.priority,
          deadline: task.deadline,
          status: task.status,
          assignee_id: task.assignee_id
        }
      }),
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
      .then((response) => {
        if(response.ok){
          getTasks()
        }
        else{
          throw new Error('Network response was not OK')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleTaskDelete = (deletedTask) => {
    console.log("DELETE ", deletedTask.name)
    if (confirm(`Are you sure you want to delete ${deletedTask.name}? This task will be permanently deleted.`)){
      fetch(`/teams/${props.teamProject.team_id}/team_projects/${props.teamProject.id}/team_project_tasks/${deletedTask.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
        .then(() => {
          getTasks()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const handleViewTaskClicked = (clickedTaskData) => {
    setViewProjectTaskModalOpen(true)
    setSelectedTaskData(clickedTaskData)
  }

  useEffect(getTasks, [])

  return (
    <div>
      <button className='btn btn-primary button-dark'
              onClick={() => {setNewProjectTaskModalOpen(true)}}>
        Create new Task
      </button>
      <br/><br/>
      {!dataIsLoading ? (
        <div>
          <ProjectTasksBoardKanban tasks={tasks} setTasks={setTasks} teamMembers={props.teamMembers} updateTask={updateTask} handleViewTaskClicked={handleViewTaskClicked}/>
        </div>
      ) : (
        <div>
          <Loader smallLoader={false}/>
        </div>
      )}
      <NewProjectTaskPopup
        newProjectTaskModalOpen={newProjectTaskModalOpen}
        setNewProjectTaskModalOpen={setNewProjectTaskModalOpen}
        teamProject={props.teamProject}
        getTasks={getTasks}
        currentUserId={props.currentUserId}
      />
      <ViewProjectTaskPopup
        viewProjectTaskModalOpen={viewProjectTaskModalOpen}
        setViewProjectTaskModalOpen={setViewProjectTaskModalOpen}
        data={selectedTaskData}
        teamMembers={props.teamMembers}
        updateTask={updateTask}
        handleTaskDelete={handleTaskDelete}
        userIsTeamAdmin={props.userIsTeamAdmin}
        currentUserId={props.currentUserId}
      />
    </div>
  )
}

ProjectTasksBoard.propTypes = {
  teamProject: PropTypes.object,
  teamMembers: PropTypes.array,
  userIsTeamAdmin: PropTypes.bool,
  currentUserId: PropTypes.number
}

export default ProjectTasksBoard