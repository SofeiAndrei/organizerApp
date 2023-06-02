import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

const InviteUserSelector = (props) => {
  const [selectedUser, setSelectedUser] = useState(props.availableUsers[0])

  console.log(props.invitedUsers)
  console.log(props.availableUsers)

  const onCancel = () => {
    props.setShowInviteUserSelector(false)
  }

  const onInvite = () => {
    console.log(selectedUser)
    const data = selectedUser
    const newInvitedUsers = [
      ...props.invitedUsers,
      {
        data,
        answer: 'no_answer'
      }
    ]
    console.log(props.invitedUsers)
    console.log(newInvitedUsers)
    props.setInvitedUsers(newInvitedUsers)
    props.setShowInviteUserSelector(false)
  }

  useEffect(() => setSelectedUser(props.availableUsers[0]), [props.availableUsers])

  return (
    <div>
      <select
        className='task-option-selector'
        defaultValue={props.availableUsers[0]}
        onChange={(e) => {
          console.log(e.target.value)
          const user = props.availableUsers.filter(user => user.id === e.target.value)[0]
          console.log(user)
          setSelectedUser(user)
        }}>
        {props.availableUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onInvite}>Invite</button>
    </div>
  )
}

InviteUserSelector.propTypes = {
  showInviteUserSelector: PropTypes.bool,
  setShowInviteUserSelector: PropTypes.func,
  invitedUsers: PropTypes.array,
  setInvitedUsers: PropTypes.func,
  availableUsers: PropTypes.array //the invitable users minus the already invited users
}

export default InviteUserSelector