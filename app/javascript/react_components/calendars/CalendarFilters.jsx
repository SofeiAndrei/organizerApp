import React, {useState} from "react";
import PropTypes from "prop-types";

const CalendarFilters = (props) => {
  const [tempFilters, setTempFilters] = useState(props.selectedFilters)

  const handleChangedCheckbox = (e) => {
    console.log(e)
    console.log(e.target.value)
    let newTempFilters
    const json = JSON.parse(e.target.value)
    console.log(json)

    if(props.teamCalendar) {
      if (e.target.checked) {
        if (e.target.id.includes('project')) {
          const newTeamProjectsFilters = tempFilters.team_projects
          newTeamProjectsFilters.push(json)
          newTempFilters = {
            team_projects: newTeamProjectsFilters,
            team_members: tempFilters.team_members
          }
        } else if (e.target.id.includes('member')) {
          const newTeamMembersFilters = tempFilters.team_members
          newTeamMembersFilters.push(json)
          newTempFilters = {
            team_projects: tempFilters.team_projects,
            team_members: newTeamMembersFilters
          }
        }
      } else {
        if (e.target.id.includes('project')) {
          newTempFilters = {
            team_projects: tempFilters.team_projects.filter(project => project.id !== json.id),
            team_members: tempFilters.team_members
          }
        } else if (e.target.id.includes('member')) {
          newTempFilters = {
            team_projects: tempFilters.team_projects,
            team_members: tempFilters.team_members.filter(member => member.id !== json.id)
          }
        }
      }
    } else {
      if (e.target.checked) {
        if (e.target.id.includes('project')) {
          const newTeamProjectsFilters = tempFilters.team_projects
          const newTeamTeamsFilters = tempFilters.teams
          newTeamProjectsFilters.push(json)

          // If the project's team is unchecked we should automatically check the team also
          if(tempFilters.teams.filter(team => team.id === json.team_id).length === 0){
            newTeamTeamsFilters.push(props.availableFilters.teams.filter(team => team.id === json.team_id)[0])
          }
          newTempFilters = {
            teams: newTeamTeamsFilters,
            team_projects: newTeamProjectsFilters,
            personal: tempFilters.personal
          }
        } else if (e.target.id.includes('personal')) {
          newTempFilters = {
            teams: tempFilters.teams,
            team_projects: tempFilters.team_projects,
            personal: !tempFilters.personal
          }
        } else {
          const newTeamProjectsFilters = tempFilters.team_projects
          const newTeamTeamsFilters = tempFilters.teams
          newTeamTeamsFilters.push(json)

          // Should check all of the team_projects for this team
          props.availableFilters.team_projects.filter(team_project => team_project.team_id === json.id).forEach(team_project => newTeamProjectsFilters.push(team_project))
          newTempFilters = {
            teams: newTeamTeamsFilters,
            team_projects: newTeamProjectsFilters,
            personal: tempFilters.personal
          }
        }
      } else {
        if (e.target.id.includes('project')) {
          newTempFilters = {
            teams: tempFilters.teams,
            team_projects: tempFilters.team_projects.filter(project => project.id !== json.id),
            personal: tempFilters.personal
          }
        } else if (e.target.id.includes('personal')) {
          newTempFilters = {
            teams: tempFilters.teams,
            team_projects: tempFilters.team_projects,
            personal: !tempFilters.personal
          }
        } else {
          // Should uncheck all of the team_projects for this team
          newTempFilters = {
            teams: tempFilters.teams.filter(team => team.id !== json.id),
            team_projects: tempFilters.team_projects.filter(project => project.team_id !== json.id),
            personal: tempFilters.personal
          }
        }
      }
    }
    setTempFilters(newTempFilters)
  }

  const handleApplyFilters = () => {
    props.handleNewSetFilters(tempFilters)
  }

  const handleResetFilters = () => {
    props.handleNewSetFilters(props.availableFilters)
    setTempFilters(props.availableFilters)
  }

  console.log(tempFilters)

  return (
    <div className='filters-container'>
      <h3>Filters:</h3>
      {props.teamCalendar ? (
        <div className='team-calendar-filters'>
          {props.availableFilters.team_projects.length > 0 && (
            <div>
              <h4>Team Project:</h4>
              {props.availableFilters.team_projects.map((project, index) => (
                <div className='filter'>
                  <input className='checkbox-filter' key={`project${index}`} type='checkbox' id={`project${index}`} value={JSON.stringify(project)} checked={tempFilters.team_projects.map(project => project.id).includes(project.id)} onChange={handleChangedCheckbox}/>
                  <label htmlFor={`project${index}`}>{project.name}</label>
                </div>
              ))}
            </div>
          )}
          <div>
            <h4>Assignee:</h4>
            {props.availableFilters.team_members.map((member, index) => (
              <div className='filter'>
                <input className='checkbox-filter' key={`member${index}`} type='checkbox' id={`member${index}`} value={JSON.stringify(member)} checked={tempFilters.team_members.map(member => member.id).includes(member.id)} onChange={handleChangedCheckbox}/>
                <label htmlFor={`member${index}`}>{member.name}</label>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='personal-calendar-filters'>
          <div className='filter'>
            <input className='checkbox-filter' key={`personal`} type='checkbox' id={`personal`} value={tempFilters.personal} checked={tempFilters.personal} onChange={handleChangedCheckbox}/>
            <label htmlFor={`personal`}>Personal</label>
          </div>
          {props.availableFilters.teams.length > 0 && (
            <div>
              <h4>Team:</h4>
              {props.availableFilters.teams.map((team, index) => (
                <div className='filter'>
                  <input className='checkbox-filter' key={`team${index}`} type='checkbox' id={`team${index}`} value={JSON.stringify(team)} checked={tempFilters.teams.map(team => team.id).includes(team.id)} onChange={handleChangedCheckbox}/>
                  <label htmlFor={`team${index}`}>{team.name}</label>
                  {props.availableFilters.team_projects.filter(team_project => team_project.team_id === team.id).length > 0 &&
                    <div className='team-team-projects-filters'>
                      <h4>Team Project:</h4>
                      {props.availableFilters.team_projects.filter(team_project => team_project.team_id === team.id).map((project, index) => (
                        <div className='filter'>
                          <input className='checkbox-filter' key={`project${index}`} type='checkbox' id={`project${index}`} value={JSON.stringify(project)} checked={tempFilters.team_projects.map(project => project.id).includes(project.id)} onChange={handleChangedCheckbox}/>
                          <label htmlFor={`project${index}`}>{project.name}</label>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={handleResetFilters} className='btn btn-primary button-dark-red'>Reset</button>
      <button onClick={handleApplyFilters} className='btn btn-primary button-dark'>Apply</button>
    </div>
  )
}

CalendarFilters.propTypes = {
  teamCalendar: PropTypes.number,
  availableFilters: PropTypes.object,
  selectedFilters: PropTypes.object,
  handleNewSetFilters: PropTypes.func
}

export default CalendarFilters