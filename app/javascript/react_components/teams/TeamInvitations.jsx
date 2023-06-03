import React from "react";
import PropTypes from "prop-types";
import {getAuthenticityToken} from "../shared/helpers";

const TeamInvitations = (props) => {

  const handleInvitationRetracted = (user) => {
    // find invitation
    const invitation = props.teamInvitations.filter(invitation => invitation.invited_id === user.id)[0]
    console.log(user.id)
    console.log(invitation)
    if (confirm(`Are you sure you want to retract the invitation for ${user.name}`)){
      console.log(invitation)
      console.log(`The id is ${invitation.id}`)
      fetch(`/team_invitations/${invitation.id}`, {
        method: 'DELETE',
        headers: {'X-CSRF-Token': getAuthenticityToken()}})
        .then((response) => {
          console.log(`Retracted the invitation for ${user.name}`)
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  console.log(props.teamInvitations)

  return (
    <div className='team_invites'>
      <h3>{`Sent Team Invitations (${props.invitedUsers ? props.invitedUsers.length : 0})`}</h3>
      {props.invitedUsers.map((user) => (
        <div key={user.id} className='team_invitation'>
          {user.name}
          {props.userIsTeamAdmin &&
            <button
              className='btn btn-primary btn-danger'
              onClick={() => handleInvitationRetracted(user)}
            >
              Retract Invitation
            </button>
          }
        </div>
      ))}
    </div>
  )
}

TeamInvitations.propTypes = {
  teamInvitations: PropTypes.array,
  invitedUsers: PropTypes.array,
  userIsTeamAdmin: PropTypes.bool,
}

export default TeamInvitations