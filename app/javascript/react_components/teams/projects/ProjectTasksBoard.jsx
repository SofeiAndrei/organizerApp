import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {callAPI} from "../../shared/helpers";
import NewProjectTaskPopup from "./NewProjectTaskPopup";
import ProjectTasksBoardKanban from "./ProjectTasksBoardKanban";

const ProjectTasksBoard = (props) => {
  const [tasks, setTasks] = useState([])
  const [dataIsLoading, setDataIsLoading] = useState(true)
  const [newProjectTaskModalOpen, setNewProjectTaskModalOpen] = useState(false)
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

  const onChangeViewType = (e) => {
    console.log(e.target.value)
    setViewTasksAsKanbanBoard(e.target.value === 'kanban')
  }

  useEffect(getTasks, [])

  console.log(tasks.length)
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
            <ProjectTasksBoardKanban tasks={tasks} setTasks={setTasks} teamMembers={props.teamMembers}/>
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
        tasks={tasks}
        setTasks={setTasks}
        teamProject={props.teamProject}
        getTasks={getTasks}
        currentUserId={props.currentUserId}
      />
    </div>
  )
}

ProjectTasksBoard.propTypes = {
  teamProject: PropTypes.object,
  teamMembers: PropTypes.array,
  currentUserId: PropTypes.number
}

export default ProjectTasksBoard