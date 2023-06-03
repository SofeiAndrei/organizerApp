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

    if(e.target.checked){
      if(e.target.id.includes('project')){
        const newTeamProjectsFilters = tempFilters.team_projects
        newTeamProjectsFilters.push(json)
        newTempFilters = {
          team_projects: newTeamProjectsFilters,
          team_members: tempFilters.team_members
        }
      } else if(e.target.id.includes('member')){
        const newTeamMembersFilters = tempFilters.team_members
        newTeamMembersFilters.push(json)
        newTempFilters = {
          team_projects: tempFilters.team_projects,
          team_members: newTeamMembersFilters
        }
      }
    } else {
      if(e.target.id.includes('project')){
        newTempFilters = {
          team_projects: tempFilters.team_projects.filter(project => project.id !== json.id),
          team_members: tempFilters.team_members
        }
      } else if(e.target.id.includes('member')){
        newTempFilters = {
          team_projects: tempFilters.team_projects,
          team_members: tempFilters.team_members.filter(member => member.id !== json.id)
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
      Filter Tasks and Events:
      {props.teamCalendar ? (
        <div className='team-calendar-filters'>
          {props.availableFilters.team_projects.length > 0 && (
            <div>
              Team Project:
              {props.availableFilters.team_projects.map((project, index) => (
                <div className='filter'>
                  <input key={`project${index}`} type='checkbox' id={`project${index}`} value={JSON.stringify(project)} checked={tempFilters.team_projects.map(project => project.id).includes(project.id)} onChange={handleChangedCheckbox}/>
                  <label htmlFor={`project${index}`}>{project.name}</label>
                </div>
              ))}
            </div>
          )}
          Assignee:
          {props.availableFilters.team_members.map((member, index) => (
            <div className='filter'>
              <input key={`member${index}`} type='checkbox' id={`member${index}`} value={JSON.stringify(member)} checked={tempFilters.team_members.map(member => member.id).includes(member.id)} onChange={handleChangedCheckbox}/>
              <label htmlFor={`member${index}`}>{member.name}</label>
            </div>
          ))}
        </div>
      ) : (
        <div className='personal-calendar-filters'>
        </div>
      )}
      <button onClick={handleResetFilters} className='btn btn-primary'>Reset</button>
      <button onClick={handleApplyFilters} className='btn btn-primary'>Apply</button>
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