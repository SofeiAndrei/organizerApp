import React from "react";
import PropTypes from "prop-types";

const TeamProjectIndex = (props) => {
  return (
    <div>
      <h4>Projects</h4>
      {(props.userIsTeamOwner || props.userIsTeamAdmin) &&
        <a
          href={`/teams/${props.team.id}/team_projects/new`}
          className='btn btn-primary'
        >Create Project
        </a>
      }
      {props.teamProjects.map(project => (
        <div key={project.id} className='team_project_index_item'>
          <a
            href={`/teams/${props.team.id}/team_projects/${project.id}`}
            className='btn'
          >{project.name}
          </a>
        </div>
      ))}
    </div>
  )
}

TeamProjectIndex.propTypes = {
  team: PropTypes.object,
  userIsTeamAdmin: PropTypes.bool,
  userIsTeamOwner: PropTypes.bool,
  teamProjects: PropTypes.array
}

export default TeamProjectIndex