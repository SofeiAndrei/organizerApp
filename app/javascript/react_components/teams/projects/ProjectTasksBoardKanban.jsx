import React from "react";
import PropTypes from "prop-types";
import ProjectTask from "./ProjectTask";

const ProjectTasksBoardKanban = (props) => {

  const taskStatuses = [
    'backlog',
    'selected_for_development',
    'in_progress',
    'testing',
    'completed'
  ]

  return(
    <div className='container'>
      <div className='row kanban-container'>
        {taskStatuses.map((status, index) =>
          <div key={index} className='col-sm-2 kanban-column-container'>
            <div className='kanban-column-header'>
              <h5>{status.toUpperCase().replaceAll('_', ' ') + ' ' + props.tasks.filter(task => task.task.status === status).length.toString()}</h5>
            </div>
            <div className='kanban-column-body'>
              {props.tasks.filter(task => task.task.status === status).map(task => {
                return <ProjectTask key={task.id} data={task}/>}
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ProjectTasksBoardKanban.propTypes = {
  tasks: PropTypes.array,
  setTasks: PropTypes.func,
  teamMembers: PropTypes.array
}

export default ProjectTasksBoardKanban