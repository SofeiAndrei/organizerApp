import React from "react";
import PropTypes from "prop-types";
import ProjectTaskKanban from "./tasks/ProjectTaskKanban";
import {DragDropContext, Droppable} from "react-beautiful-dnd"
import {formatWords} from "../../shared/formater_helper";

const ProjectTasksBoardKanban = (props) => {

  const taskStatuses = [
    'backlog',
    'selected_for_development',
    'in_progress',
    'testing',
    'completed'
  ]
  const onDragEnd = (result) => {
    if (result.destination.droppableId !== result.source.droppableId) {
      const taskToUpdate = props.tasks.filter(task => task.task.id.toString() === result.draggableId).map(task_data => task_data.task)[0]
      taskToUpdate.status = result.destination.droppableId
      console.log(taskToUpdate)
      props.updateTask(taskToUpdate)
    }
  }

  return(
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div className='row kanban-container'>
          {taskStatuses.map((status, index) =>
            <Droppable droppableId={status}>
              { (provided) => (
                <div className='col kanban-column-container'
                     ref={provided.innerRef}
                     {...provided.droppableProps}
                >
                  <div className='kanban-column-header'>
                    <h5>{formatWords(status, true) + ' ' + props.tasks.filter(task => task.task.status === status).length.toString()}</h5>
                  </div>
                  <div className='kanban-column-body'>
                    {props.tasks.filter(task => task.task.status === status).map((task, index) =>
                      <ProjectTaskKanban key={task.id} data={task} index={index} handleViewTaskClicked={props.handleViewTaskClicked}/>
                    )}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      </div>
    </DragDropContext>
  )
}

ProjectTasksBoardKanban.propTypes = {
  tasks: PropTypes.array,
  setTasks: PropTypes.func,
  teamMembers: PropTypes.array,
  updateTask: PropTypes.func,
  handleViewTaskClicked: PropTypes.func
}

export default ProjectTasksBoardKanban