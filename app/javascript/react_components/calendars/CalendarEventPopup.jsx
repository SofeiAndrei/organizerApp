import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
import {getAuthenticityToken} from "../shared/helpers";

const CalendarEventPopup = (props) => {
  const [editPressed, setEditPressed] = useState(props.newEvent)
  const [name, setName] = useState(props.newEvent ? '' : props.event.name)
  const [description, setDescription] = useState(props.newEvent ? '' : props.event.description)
  const [allDayEvent, setAllDayEvent] = useState(props.newEvent ? false : props.event.all_day_event)
  const [eventStart, setEventStart] = useState(props.newEvent ? props.defaultDate : props.event.event_start)
  const [eventEnd, setEventEnd] = useState(props.newEvent ? props.defaultDate : props.event.event_end)

  const handleModalClose = () => {
    props.setCalendarEventPopupOpen(false)
  }

  const cancelChanges = () => {
    setName('')
    setDescription('')
    setAllDayEvent(false)
    setEventStart(props.defaultDate)
    setEventEnd(props.defaultDate)
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
          organizer_id: props.currentUserId
        }
      }),
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
      .then((response) => {
        if(response.ok){
          props.getTasks()
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

  const setEventData = () => {
    setName(props.newEvent ? '' : props.event.name)
    setDescription(props.newEvent ? '' : props.event.description)
    setAllDayEvent(props.newEvent ? false : props.event.all_day_event)
    setEventStart(props.newEvent ? props.defaultDate : props.event.event_start)
    setEventEnd(props.newEvent ? props.defaultDate : props.event.event_end)
    setEditPressed(props.newEvent)
  }

  useEffect(setEventData, [props.event, props.newEvent])

  return (
    <Modal show={props.calendarEventPopupOpen} onHide={() => handleModalClose()} animation={false}>
      <Modal.Body>
        {editPressed ? (
          <div>
            <div>
              <label htmlFor="name">Name:</label>
              <input type='text' id='name' placeholder='Add a name...' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea className='description-input' id='description' placeholder='Add a description...' value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="all-day-event">All Day Event:</label>
              <input type='checkbox' id='all-day-event' checked={allDayEvent} onChange={() => setAllDayEvent(!allDayEvent)}/>
            </div>
            {allDayEvent ? (
              <div>
                <div>
                  <label htmlFor="event-start">Event Start Time:</label>
                  <input type="date" id="event-start" name="event-start" value={eventStart.slice(0, 10)} onChange={(e) => {
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
                  <input type="date" id="event-end" name="event-end" value={eventEnd.slice(0, 10)} min={eventStart.slice(0, 10)} onChange={(e) => setEventEnd(e.target.value)}/>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <label htmlFor="event-start">Event Start Time:</label>
                  <input type="datetime-local" id="event-start" name="event-start" value={eventStart} onChange={(e) => {
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
                  <input type="datetime-local" id="event-end" name="event-end" value={eventEnd} min={eventStart} onChange={(e) => setEventEnd(e.target.value)}/>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>{name}</p>
            <p>{description}</p>
            <p>{eventStart} - {eventEnd}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => cancelChanges()}>{props.newEvent ? 'Cancel' : 'Back'}</Button>
        <Button className={props.newEvent || editPressed ? 'hidden' : ''}
                onClick={() => setEditPressed(true)}>{'Edit'}</Button>
        <Button className={editPressed ? '' : 'hidden'}
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
  getTasks: PropTypes.func
}

export default CalendarEventPopup