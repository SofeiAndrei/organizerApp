import React from "react";
import PropTypes from "prop-types";

const ProjectTask = (props) => {
  return (
    <div className="card task-card">
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
  )
}

ProjectTask.propTypes = {
  data: PropTypes.object,
}

export default ProjectTask