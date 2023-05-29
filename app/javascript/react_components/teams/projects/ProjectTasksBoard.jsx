import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {callAPI, getAuthenticityToken} from "../../shared/helpers";
import NewProjectTaskPopup from "./tasks/NewProjectTaskPopup";
import ProjectTasksBoardKanban from "./ProjectTasksBoardKanban";
import ViewProjectTaskPopup from "./tasks/ViewProjectTaskPopup";

const ProjectTasksBoard = (props) => {
  const [tasks, setTasks] = useState([])
  const [dataIsLoading, setDataIsLoading] = useState(true)
  const [newProjectTaskModalOpen, setNewProjectTaskModalOpen] = useState(false)
  const [viewProjectTaskModalOpen, setViewProjectTaskModalOpen] = useState(false)
  const [selectedTaskData, setSelectedTaskData] = useState({})
  const [viewTasksAsKanbanBoard, setViewTasksAsKanbanBoard] = useState(true)

  const getTasks = () => {
    callAPI(`/api/team_projects/${props.teamProject.id}/get_project_tasks`, 'GET')
      .then((json) => {
        console.log(json.tasks)
        console.log("got project tasks")
        setTasks(json.tasks)
        setDataIsLoading(false)
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

  const onChangeViewType = (e) => {
    console.log(e.target.value)
    setViewTasksAsKanbanBoard(e.target.value === 'kanban')
  }

  const handleViewTaskClicked = (clickedTaskData) => {
    setViewProjectTaskModalOpen(true)
    setSelectedTaskData(clickedTaskData)
  }

  useEffect(getTasks, [])

  return (
    <div>
      <button className='btn btn-primary'
              onClick={() => {setNewProjectTaskModalOpen(true)}}>
        Create new Task
      </button>
      {!dataIsLoading &&
        <div>
          <div className='radio-button-group-container'>
            <div className='radio-button-div'>
              <label className='radio-label' htmlFor='kanban'>Kanban board</label>
              <input className='radio-button' type='radio' id='kanban' name='kanban' value='kanban' checked={viewTasksAsKanbanBoard} onChange={onChangeViewType}/>
            </div>
            <div className='radio-button-div'>
              <label className='radio-label' htmlFor='task_list'>Task List</label>
              <input className='radio-button' type='radio' id='task_list' name='task_list' value='task_list' checked={!viewTasksAsKanbanBoard} onChange={onChangeViewType}/>
            </div>
          </div>
          {viewTasksAsKanbanBoard &&
            <ProjectTasksBoardKanban tasks={tasks} setTasks={setTasks} teamMembers={props.teamMembers} updateTask={updateTask} handleViewTaskClicked={handleViewTaskClicked}/>
          }
          {!viewTasksAsKanbanBoard &&
            <div>
              Task List View
            </div>
          }
        </div>
      }
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
        getTasks={getTasks}
      />
    </div>
  )
}

ProjectTasksBoard.propTypes = {
  teamProject: PropTypes.object,
  teamMembers: PropTypes.array,
  userIsTeamAdmin: PropTypes.bool,
  userIsTeamOwner: PropTypes.bool,
  currentUserId: PropTypes.number
}

export default ProjectTasksBoard