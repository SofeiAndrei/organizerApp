import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
import {getAuthenticityToken} from "../shared/helpers";
import InviteUserSelector from "./InviteUserSelector";

const CalendarEventPopup = (props) => {
  const [editPressed, setEditPressed] = useState(props.newEvent)
  const [name, setName] = useState(props.newEvent ? '' : props.event.name)
  const [description, setDescription] = useState(props.newEvent ? '' : props.event.description)
  const [allDayEvent, setAllDayEvent] = useState(props.newEvent ? false : props.event.all_day_event)
  const [eventStart, setEventStart] = useState(props.newEvent ? props.defaultDate : props.event.event_start)
  const [eventEnd, setEventEnd] = useState(props.newEvent ? props.defaultDate : props.event.event_end)
  const data = props.invitableUsers.filter(user => user.id === props.currentUserId)[0]
  const [invitedUsers, setInvitedUsers] = useState(props.newEvent ? [{data, answer: 'organizer'}] : props.event.invited_users)
  const [showInviteUserSelector, setShowInviteUserSelector] = useState(false)
  console.log(props.event.invited_users)
  const [yourAnswer, setYourAnswer] = useState((props.newEvent || !props.event.invited_users) ? 'new_event' : props.event.invited_users.filter(user => user.data.id === props.currentUserId)[0].answer)
  const answers = [
    {id: 1, name: 'no_answer'},
    {id: 2, name: 'yes'},
    {id: 3, name: 'no'},
  ]

  const handleModalClose = () => {
    setYourAnswer('new_event')
    props.setCalendarEventPopupOpen(false)
  }

  const cancelChanges = () => {
    setName('')
    setDescription('')
    setAllDayEvent(false)
    setEventStart(props.defaultDate)
    setEventEnd(props.defaultDate)
    const data = props.invitableUsers.filter(user => user.id === props.currentUserId)[0]
    setInvitedUsers([{data, answer: 'organizer'}])
    setYourAnswer('new_event')
    if(!props.newEvent){
      setEditPressed(false)
    }
    handleModalClose()
  }

  const onSave = () => {
    let method
    let url
    if(props.newEvent){
      method = 'POST'
      url = `/api/calendar_events/`
      console.log("create new event")
      if(props.currentTeamId){
        console.log("You also need to add the team_id to the params")
      } else {
        console.log("It's a personal event, so team_id is nil")
      }
    } else {
      method = 'PATCH'
      url = `/api/calendar_events/${props.event.real_id}`
      console.log("update already existing event")
    }

    fetch(url, {
      method: method,
      body: JSON.stringify({
        calendar_event: {
          name: name,
          description: description,
          all_day_event: allDayEvent,
          event_start: eventStart,
          event_end: eventEnd,
          team_id: props.currentTeamId,
          organizer_id: props.currentUserId,
        },
        invited_users_ids: invitedUsers.map(user => user.data.id)
      }),
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
      .then((response) => {
        if(response.ok){
          props.getCalendarEvents()
        }
        else{
          throw new Error('Network response was not OK')
        }
      })
      .catch(error => {
        console.log(error)
      })

    cancelChanges()
  }

  const handleSendAnswer = () => {
    fetch(`/calendar_event_invitations/${props.event.real_id}/${props.currentUserId}/${yourAnswer}`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
      .then((response) => {
        if(response.ok){
          props.getCalendarEvents()
        }
        else{
          throw new Error('Network response was not OK')
        }
      })
      .catch(error => {
        console.log(error)
      })
    handleModalClose()
  }

  const setEventData = () => {
    setName(props.newEvent ? '' : props.event.name)
    setDescription(props.newEvent ? '' : props.event.description)
    setAllDayEvent(props.newEvent ? false : props.event.all_day_event)
    setEventStart(props.newEvent ? props.defaultDate : props.event.event_start)
    setEventEnd(props.newEvent ? props.defaultDate : props.event.event_end)
    setEditPressed(props.newEvent)
    const data = props.invitableUsers.filter(user => user.id === props.currentUserId)[0]
    setInvitedUsers(props.newEvent ? [{data, answer: 'organizer'}] : props.event.invited_users)
    setYourAnswer((props.newEvent || !props.event.invited_users) ? 'new_event' : props.event.invited_users.filter(user => user.data.id === props.currentUserId)[0].answer)
  }

  const handleRemoveInvitedUser = (userId) => {
    setInvitedUsers(invitedUsers.filter(user => user.data.id !== userId))
  }

  useEffect(setEventData, [props.event, props.newEvent])

  console.log(invitedUsers)

  return (
    <Modal show={props.calendarEventPopupOpen} onHide={() => handleModalClose()} animation={false}>
      <Modal.Body>
        {editPressed ? (
          <div>
            <div>
              <label htmlFor="name">Name:</label>
              <input className='form-control' type='text' id='name' placeholder='Add a name...' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea className='description-input form-control' id='description' placeholder='Add a description...' value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="all-day-event">All Day Event:</label>
              <input className='form-control' type='checkbox' id='all-day-event' checked={allDayEvent} onChange={() => setAllDayEvent(!allDayEvent)}/>
            </div>
            {allDayEvent ? (
              <div>
                <div>
                  <label htmlFor="event-start">Event Start Time:</label>
                  <input className='form-control' type="date" id="event-start" name="event-start" value={eventStart.slice(0, 10)} onChange={(e) => {
                    setEventStart(e.target.value)
                    const startDate = new Date(e.target.value).getTime()
                    const endDate = new Date(eventEnd).getTime()
                    if(startDate > endDate){
                      setEventEnd(e.target.value)
                    }
                  }}/>
                </div>
                <div>
                  <label htmlFor="event-end">Event End Time:</label>
                  <input className='form-control' type="date" id="event-end" name="event-end" value={eventEnd.slice(0, 10)} min={eventStart.slice(0, 10)} onChange={(e) => setEventEnd(e.target.value)}/>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <label htmlFor="event-start">Event Start Time:</label>
                  <input className='form-control' type="datetime-local" id="event-start" name="event-start" value={eventStart} onChange={(e) => {
                    setEventStart(e.target.value)
                    const startDate = new Date(e.target.value).getTime()
                    const endDate = new Date(eventEnd).getTime()
                    if(startDate > endDate){
                      setEventEnd(e.target.value)
                    }
                  }}/>
                </div>
                <div>
                  <label htmlFor="event-end">Event End Time:</label>
                  <input className='form-control' type="datetime-local" id="event-end" name="event-end" value={eventEnd} min={eventStart} onChange={(e) => setEventEnd(e.target.value)}/>
                </div>
              </div>
            )}
            <table>
              <tbody>
              {invitedUsers.map(user => (
                <tr key={user.data.id}>
                  <td>{user.data.name}</td>
                  <td>{user.answer}</td>
                  {user.data.id !== props.currentUserId &&
                    <td key={user.data.id}>
                      <button
                        className='btn btn-primary button-dark-red'
                        onClick={() => handleRemoveInvitedUser(user.data.id)}
                      >
                        Remove
                      </button>
                    </td>
                  }
                </tr>
              ))}
              </tbody>
            </table>
            {invitedUsers.length !== props.invitableUsers.length &&
              <button
                onClick={() => setShowInviteUserSelector(true)}
                className='btn btn-primary button-dark'
              >Invite User
              </button>
            }
            {showInviteUserSelector &&
              <InviteUserSelector
                showInviteUserSelector={showInviteUserSelector}
                setShowInviteUserSelector={setShowInviteUserSelector}
                invitedUsers={invitedUsers}
                setInvitedUsers={setInvitedUsers}
                availableUsers={props.invitableUsers.filter(user => !invitedUsers.map(user => user.data.id).includes(user.id))}
              />
            }
          </div>
        ) : (
          <div>
            <p>{name}</p>
            <p>{description}</p>
            <p>{eventStart} - {eventEnd}</p>
            {props.event.invited_users &&
              <table>
                <tbody>
                  {props.event.invited_users.map(user => (
                    <tr key={user.data.id}>
                      <td>{user.data.name}</td>

                      {props.currentUserId !== props.event.organizer_id && props.currentUserId === user.data.id ? (
                        <div>
                          <td>
                            <select
                              className='form-control answer'
                              onChange={(e) => {setYourAnswer(e.target.value)}}
                              defaultValue={yourAnswer}
                            >
                            {answers.map((answer) => (
                              <option key={answer.id} value={answer.name}>
                                {answer.name}
                              </option>
                            ))}
                            </select>
                          </td>
                          {yourAnswer !== user.answer &&
                            <button className='btn btn-primary button-dark answer' onClick={handleSendAnswer}>
                              Send Answer
                            </button>
                          }
                        </div>
                      ) : (
                        <td>{user.answer}</td>
                      )
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn btn-primary button-dark' onClick={() => cancelChanges()}>{props.newEvent ? 'Cancel' : 'Back'}</Button>
        <Button className={props.newEvent || editPressed || props.event.organizer_id !== props.currentUserId ? 'hidden' : 'btn btn-primary button-dark'}
                onClick={() => setEditPressed(true)}>{'Edit'}</Button>
        <Button className={props.newEvent || (editPressed && props.event.organizer_id === props.currentUserId) ? 'btn btn-primary button-dark' : 'hidden'}
                onClick={() => onSave()}>{'Save'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

CalendarEventPopup.propTypes = {
  defaultDate: PropTypes.string,
  newEvent: PropTypes.bool,
  event: PropTypes.object,
  calendarEventPopupOpen: PropTypes.bool,
  setCalendarEventPopupOpen: PropTypes.func,
  currentTeamId: PropTypes.number,
  currentUserId: PropTypes.number,
  getCalendarEvents: PropTypes.func,
  invitableUsers: PropTypes.array
}

export default CalendarEventPopup