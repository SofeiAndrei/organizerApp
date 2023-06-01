import React, {useState} from "react";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
import {callAPI, getAuthenticityToken} from "../shared/helpers";
import SearchResults from "../SearchResults";

const AddUserToTeamPopup = (props) => {
  const [userSearchInput, setUserSearchInput] = useState('')
  const [findUserById, setFindUserById] = useState(false)
  const [searchResultUsers, setSearchResultUsers] = useState([])
  const [usersToInvite, setUsersToInvite] = useState([])

  const handleModalClose = () => {
    setUserSearchInput('')
    setFindUserById(false)
    setSearchResultUsers([])
    setUsersToInvite([])

    props.setAddUserToTeamModalOpen(false)
  }

  const handleSearchInputChange = (e) => {
    setUserSearchInput(e.target.value)
    searchUsers(findUserById, e.target.value)
  }

  const onChangeSearchType = (e) => {
    setFindUserById(e.target.value === 'by_id')
  }

  const addUserToInviteList = (invitedUser) => {
    console.log(invitedUser)
    setUserSearchInput('')
    if(!usersToInvite.includes(invitedUser)) {
      console.log(usersToInvite)
      console.log(invitedUser)
      setUsersToInvite([...usersToInvite, invitedUser])
    }
    setSearchResultUsers([])
  }

  const inviteUser = (user) => {
    fetch(`/team_invitations`, {
      method: 'POST',
      body: JSON.stringify({
        team_id: props.team.id,
        invited_id: user.id
      }),
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
      .then((response) => {
        if(response.ok){
          console.log(response)
          console.log("User invited successfully")
        }
        else{
          throw new Error('Network response was not OK')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const onInviteUsers = () => {
    usersToInvite.forEach(user => {
      inviteUser(user)
    })
    window.location.reload()
    handleModalClose()
  }

  const getAlreadySelectedUserIds = () => {
    console.log("GET ALREADY SELECTED USER IDS")
    const selectedUserIds = usersToInvite.map(user => user.id).concat(
      props.invitedUsers.map(user => user.id),
      props.members.map(user => user.id))
    console.log(selectedUserIds)
    return selectedUserIds
  }

  const searchUsers = (findUserById, userSearchInput) => {
    console.log("I searched the users")
    console.log(userSearchInput)
    callAPI(`/api/users/search_users?search_by_id=${findUserById}&search_input=${userSearchInput}`, 'GET', {already_selected_ids: getAlreadySelectedUserIds()})
      .then((json) => {
        console.log(json)
        console.log(json.users)
        console.log(`Searched for Users with search_by_id=${findUserById} and search_input=${userSearchInput}`)
        setSearchResultUsers(json.users)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const onUserDelete = (user) => {
    console.log("Remove user from users_to_invite list")
    const newUsersToInvite = usersToInvite.filter(filteredUser => filteredUser.id !== user.id)
    setUsersToInvite(newUsersToInvite)

    setUserSearchInput('')
  }

  console.log(usersToInvite)

  return (
    <Modal show={props.addUserToTeamModalOpen} onHide={() => handleModalClose()} animation={false}>
      <Modal.Header>
        <Modal.Title>
          Add a new team member
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {usersToInvite.length > 0 &&
          <div className='users_to_invite'>
            Select Users to invite:
            <br/>
            <div className='tags-container'>
              <div className='content-tags'>
                {usersToInvite.map((user, index) =>
                  <div key={index} className='tag-row'>
                    <div className='tag-text-container'>
                      <div className='text'>
                        {user.name}
                      </div>
                    </div>
                    <a type='button' className='delete-tag-button' onClick={() => onUserDelete(user)}>
                      x
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        <div className='radio-button-group-container'>
          <div className='radio-button-div'>
            <label className='radio-label' htmlFor='by_name'>By Name</label>
            <input className='radio-button' type='radio' id='by_name' name='by_name' value='by_name' checked={!findUserById} onChange={onChangeSearchType}/>
          </div>
          <div className='radio-button-div'>
            <label className='radio-label' htmlFor='by_id'>By Id</label>
            <input className='radio-button' type='radio' id='by_id' name='by_id' value='by_id' checked={findUserById} onChange={onChangeSearchType}/>
          </div>
        </div>
        <div className='content'>
          <div>
            <label htmlFor="search_input">Search for User:</label>
            <input type='text' id='search_input' value={userSearchInput} onChange={handleSearchInputChange}/>
          </div>
        </div>
        {searchResultUsers.length === 0 && userSearchInput !== '' &&
          <div>
            No results for the provided input
          </div>
        }
        {searchResultUsers.length > 0 &&
          <SearchResults
            searchResults={searchResultUsers}
            onClickSearchResult={addUserToInviteList}
          />
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => handleModalClose()}>Cancel</Button>
        {usersToInvite.length > 0 &&
          <Button onClick={() => onInviteUsers()}>Invite!</Button>
        }
      </Modal.Footer>
    </Modal>
  )
}

AddUserToTeamPopup.propTypes = {
  team: PropTypes.object,
  invitedUsers: PropTypes.array,
  members: PropTypes.array,
  addUserToTeamModalOpen: PropTypes.bool,
  setAddUserToTeamModalOpen: PropTypes.func,
}

export default AddUserToTeamPopup