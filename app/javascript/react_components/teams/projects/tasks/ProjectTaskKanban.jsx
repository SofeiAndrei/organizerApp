import React from "react";
import PropTypes from "prop-types";
import {Draggable} from "react-beautiful-dnd";

const ProjectTaskKanban = (props) => {
  return (
    <Draggable draggableId={props.data.task.id.toString()} index={props.index}>
      {(provided) => (
        <div className="card task-card"
             onClick={() => props.handleViewTaskClicked(props.data)}
             ref={provided.innerRef}
             {...provided.draggableProps}
             {...provided.dragHandleProps}
        >
          <div className="card-body">
            <p className="card-text task-name">{props.data.task.name}</p>
            <div className='task-tags'>
              <span className="badge task-tag">{'FakeTag'}</span>
            </div>
            <div className='task-footer'>
              <div className='card-text'>{props.data.task.priority}</div>
              {props.data.assignee !== null &&
                <div className="card-text">{props.data.assignee.name + '#' + props.data.assignee.id}</div>
              }
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

ProjectTaskKanban.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  setViewProjectTaskModalOpen: PropTypes.func
}

export default ProjectTaskKanban