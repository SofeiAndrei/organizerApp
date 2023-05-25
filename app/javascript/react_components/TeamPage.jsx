import React, {useState} from "react";
import PropTypes from "prop-types";
import {getAuthenticityToken} from "./shared/helpers";
import AddUserToTeamPopup from "./AddUserToTeamPopup";

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
        </div>
      }
      {props.userIsTeamOwner &&
        <div className='team-owner-commands'>
          <a href={`/teams/${props.team.id}/edit`} className='btn btn-primary'>Edit Team</a>
          <button
            className='btn btn-primary btn-danger delete-list-button'
            onClick={() => {handleTeamDelete()}}>Delete
          </button>
        </div>
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
  members: PropTypes.array,
  userIsTeamAdmin: PropTypes.bool,
  userIsTeamOwner: PropTypes.bool
}

export default TeamPage