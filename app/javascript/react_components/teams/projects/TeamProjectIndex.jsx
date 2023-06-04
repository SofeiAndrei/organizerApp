import React from "react";
import PropTypes from "prop-types";

const TeamProjectIndex = (props) => {
  return (
    <div>
      <h3>{`Projects (${props.teamProjects ? props.teamProjects.length : 0})`}</h3>
      {(props.userIsTeamOwner || props.userIsTeamAdmin) &&
        <a
          href={`/teams/${props.team.id}/team_projects/new`}
          className='btn btn-primary button-dark'
        >Create Project
        </a>
      }
      <ul className="team-projects">
        {props.teamProjects.map(project => (
          <li key={project.id} className='team_project_index_item'>
            <a
              href={`/teams/${props.team.id}/team_projects/${project.id}`}
              className='team-project-link'
            >{project.name}
            </a>
          </li>
        ))}
      </ul>
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