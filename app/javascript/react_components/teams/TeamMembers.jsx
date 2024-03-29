import React from "react";
import PropTypes from "prop-types";
import {getAuthenticityToken} from "../shared/helpers";

const TeamMembers = (props) => {

  const handleKickUser = (user) => {
    // find membership
    const membership = props.teamMemberships.filter(membership => membership.member_id === user.id)[0]
    console.log(user.id)
    console.log(membership)
    if (confirm(`Are you sure you want to kick ${user.name} out of the team?`)){
      console.log(membership)
      console.log(`The id is ${membership.id}`)
      fetch(`/team_memberships/${membership.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
        .then((response) => {
          console.log(`Kicked ${user.name} out of the team`)
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const handleChangeAdminStatus = (user) => {
    const changeAdminStatusMethod = adminStatusButtonText(user).toLowerCase()
    const membership = props.teamMemberships.filter(membership => membership.member_id === user.id)[0]
    console.log(user.id)
    console.log(membership)

    fetch(`/team_memberships/${membership.id}/${changeAdminStatusMethod}`, {
      method: 'PATCH',
      headers: {'X-CSRF-Token': getAuthenticityToken()}})
      .then((response) => {
        console.log(`${changeAdminStatusMethod}ed ${user.name}`)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
      })
  }

  const adminStatusButtonText = (user) => {
    return user.team_admin ? 'Demote' : 'Promote'
  }

  console.log(props.members)

  return (
    <div className='team_members'>
      <h3>{`Team Members (${props.members.length})`}</h3>
      {props.members.map((user) => (
        <div key={user.id} className='team_member'>
          <a href={`/users/${user.id}` } className='team-member-link'>{user.name}</a>
          {props.userIsTeamOwner && props.currentUserId !== user.id &&
            <button
              className='btn btn-primary button-dark-red'
              onClick={() => handleKickUser(user)}
            >
              Kick
            </button>
          }
          {props.userIsTeamOwner && props.currentUserId !== user.id &&
            <button
              className='btn btn-primary button-dark'
              onClick={() => handleChangeAdminStatus(user)}
            >
              {adminStatusButtonText(user)}
            </button>
          }
        </div>
      ))}
    </div>
  )
}

TeamMembers.propTypes = {
  teamMemberships: PropTypes.array,
  members: PropTypes.array,
  userIsTeamOwner: PropTypes.bool,
  currentUserId: PropTypes.number
}

export default TeamMembers