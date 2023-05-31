import React, {useState} from "react";
import PropTypes from "prop-types";
import {getAuthenticityToken} from "../shared/helpers";
import AddUserToTeamPopup from "./AddUserToTeamPopup";
import TeamInvitations from "./TeamInvitations";
import TeamMembers from "./TeamMembers";
import TeamProjectIndex from "./projects/TeamProjectIndex";

const TeamPage = (props) => {
  const [addUserToTeamModalOpen, setAddUserToTeamModalOpen] = useState(false)

  const handleTeamDelete = () => {
    if (confirm(`Are you sure you want to delete ${props.team.name}? This record will be permanently deleted.`)){
      fetch(`${props.team.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
        .then((response) => {
          console.log(`Deleted ${props.team.name} Team`)
          window.location.replace(response.url)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const handleLeaveTeam = () => {
    const membership = props.teamMemberships.filter(membership => membership.member_id === props.currentUserId)[0]
    console.log(props.currentUserId)
    console.log(membership)
    if (confirm(`Are you sure you want to leave the ${props.team.name} team?`)){
      fetch(`/team_memberships/${membership.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
        .then((response) => {
          window.location.replace(`/users/${props.currentUserId}/my_teams`)
          console.log(`Left the team!`)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  console.log(props.team)
  console.log(props.invitedUsers)

  return (
    <div>
      <h1>
        {props.team.name}
      </h1>
      {props.userIsTeamAdmin &&
        <div className='team-admin-commands'>
          <button
            className='btn btn-primary'
            onClick={() => {setAddUserToTeamModalOpen(true)}}
          >Invite Users
          </button>
          <br/>
          <TeamInvitations teamInvitations={props.teamInvitations} invitedUsers={props.invitedUsers} userIsTeamAdmin={props.userIsTeamAdmin}/>
        </div>
      }
      <TeamMembers teamMemberships={props.teamMemberships} members={props.members} userIsTeamOwner={props.userIsTeamOwner} currentUserId={props.currentUserId}/>
      <TeamProjectIndex team={props.team} userIsTeamAdmin={props.userIsTeamAdmin} userIsTeamOwner={props.userIsTeamOwner} teamProjects={props.teamProjects}/>
      <a href={`/teams/${props.team.id}/calendar`} className='btn btn-primary'>Team Calendar</a>
      {props.userIsTeamOwner ? (
        <div className='team-owner-commands'>
          <a href={`/teams/${props.team.id}/edit`} className='btn btn-primary'>Edit Team</a>
          <button
            className='btn btn-primary btn-danger delete-list-button'
            onClick={() => {handleTeamDelete()}}>Delete
          </button>
        </div>
      ) : (
        <button
          className='btn btn-primary btn-danger'
          onClick={handleLeaveTeam}
        >Leave Team
        </button>
      )
      }

      <AddUserToTeamPopup
        team={props.team}
        invitedUsers={props.invitedUsers}
        members={props.members}
        addUserToTeamModalOpen={addUserToTeamModalOpen}
        setAddUserToTeamModalOpen={setAddUserToTeamModalOpen}
      />
    </div>
  )
}

TeamPage.propTypes = {
  team: PropTypes.object,
  invitedUsers: PropTypes.array,
  teamInvitations: PropTypes.array,
  members: PropTypes.array,
  teamMemberships: PropTypes.array,
  userIsTeamAdmin: PropTypes.bool,
  userIsTeamOwner: PropTypes.bool,
  currentUserId: PropTypes.number,
  teamProjects: PropTypes.array
}

export default TeamPage