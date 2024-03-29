import React, { useState, useEffect }from 'react'
import { getAuthenticityToken, callAPI } from "../shared/helpers";
import PropTypes from 'prop-types'
import Calendar from "react-calendar";
import {DayPilot, DayPilotCalendar} from "daypilot-pro-react";
import {formatDate} from "../shared/calendar_helper";
import CalendarEventPopup from "./CalendarEventPopup";
import CalendarTaskPopup from "./CalendarTaskPopup";
import CalendarFilters from "./CalendarFilters";

const CalendarPage = (props) => {
  const [calendarType, setCalendarType] = useState('today') // 1 -> today, 2 -> 3days, 3 -> week
  const [selectedDate, setSelectedDate] = useState(new Date(props.currentDate.year, props.currentDate.month, props.currentDate.day))
  const [pilotSelectedDate, setPilotSelectedDate] = useState(DayPilot.Date.today())
  const [calendarReference, setCalendarReference] = useState(React.createRef())

  const [calendarEventPopupOpen, setCalendarEventPopupOpen] = useState(false)
  const [calendarTaskPopupOpen, setCalendarTaskPopupOpen] = useState(false)

  const [events, setEvents] = useState([])

  const [newEvent, setNewEvent] = useState(true)
  const [eventData, setEventData] = useState({})

  const [selectedFilters, setSelectedFilters] = useState(props.availableFilters)

  const getCalendarEvents = () => {
    const url = props.userCalendar ?
      `/api/users/${props.currentUserId}/calendar_filtered_events` :
      `/api/teams/${props.currentTeamId}/calendar_filtered_events`

    let data
    if(props.userCalendar){
      data = {filters: {team_projects_ids: selectedFilters.team_projects.map(project => project.id), teams_ids: selectedFilters.teams.map(team => team.id), personal: selectedFilters.personal}}
    } else {
      data = {filters: {team_projects_ids: selectedFilters.team_projects.map(project => project.id), team_members_ids: selectedFilters.team_members.map(member => member.id)}}
    }
    console.log(url)
    callAPI(url, 'GET', data)
      .then((json) => {
        console.log(json)
        const events = json.events
        console.log(events)
        console.log(`there are the calendar events I got for ${props.userCalendar ? 'userCalendar' : 'teamCalendar'}`)
        setEvents(events)
        calendar().update({events})
      })
      .catch(error => {
        console.log(error)
      })
  }

  const onChangeCalendarType = (e) => {
    setCalendarType(e.target.value)
  }

  const selectNewDate = (value) => {
    setSelectedDate(value)
    const newDate = new DayPilot.Date(formatDate(value))
    setPilotSelectedDate(newDate)
  }

  const calendar = () => {
    return calendarReference.current.control
  }

  const handleClickCalendarEvent = (clickedEvent) => {
    const filteredUsersForAssignee = props.invitableUsers.filter(user => user.id === clickedEvent.tags.assignee_id)
    const clickedEventData = {
      name: clickedEvent.text,
      description: clickedEvent.tags.description,
      all_day_event: clickedEvent.allday,
      event_start: clickedEvent.start.value,
      event_end: clickedEvent.end.value,
      type: clickedEvent.tags.type,
      real_id: clickedEvent.tags.real_id,
      organizer_id: clickedEvent.tags.organizer_id,
      invited_users: clickedEvent.tags.invited_users,
      assignee: filteredUsersForAssignee.length > 0 ? filteredUsersForAssignee[0].name : null,
      project_name: clickedEvent.tags.project_name
    }
    setNewEvent(false)

    console.log("SALUT", clickedEvent.tags.organizer_id === props.currentUserId)
    if(clickedEvent.tags.type.includes('task')){
      setCalendarTaskPopupOpen(true)
    } else {
      setCalendarEventPopupOpen(true)
    }
    console.log(clickedEventData)
    console.log("salut")
    setEventData(clickedEventData)
    console.log("again")
  }

  const handleNewSetFilters = (filters) => {
    setSelectedFilters(filters)
  }

  useEffect(getCalendarEvents, [selectedFilters])
  useEffect(() => {calendar().update({events})})

  console.log(props.availableFilters)
  return (
    <div className='container'>
      <div>
        <Calendar onChange={selectNewDate}/>
      </div>
      <div className='calendar-events-container row'>
        <div className='col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 filters'>
          <div className='row'>
            <div className='col-3 col-xs-3 col-sm-3 col-md-12 col-lg-12 col-xl-12 view-list'>
              <br/>
              <button
                className='btn btn-primary button-dark'
                onClick={() => {
                  setCalendarEventPopupOpen(true)
                  setNewEvent(true)
                }}>
                {`Create ${props.userCalendar ? '' : 'Team '}Event`}
              </button>
              <h3>{`Selected Date:`}</h3>
              {selectedDate.toDateString()}
              <br/><br/>
              <div className='radio-button-group-container'>
                <div className='form-control radio-button-div'>
                  <label className='radio-label' htmlFor='today'>Today</label>
                  <input className='radio-button radio-button-red' type='radio' id='today' name='today' value='today' checked={calendarType === 'today'} onChange={onChangeCalendarType}/>
                </div>
                <div className='form-control radio-button-div'>
                  <label className='radio-label' htmlFor='3days'>3 Days</label>
                  <input className='radio-button radio-button-red' type='radio' id='3days' name='3days' value='3days' checked={calendarType === '3days'} onChange={onChangeCalendarType}/>
                </div>
                <div className='form-control radio-button-div'>
                  <label className='radio-label' htmlFor='week'>Week</label>
                  <input className='radio-button radio-button-red' type='radio' id='week' name='week' value='week' checked={calendarType === 'week'} onChange={onChangeCalendarType}/>
                </div>
              </div>
            </div>
            <div className='col-9 col-xs-9 col-sm-9 col-md-12 col-lg-12 col-xl-12 filter-list'>
              <CalendarFilters
                teamCalendar={props.currentTeamId}
                availableFilters={props.availableFilters}
                selectedFilters={selectedFilters}
                handleNewSetFilters={handleNewSetFilters}
              />
            </div>
          </div>
        </div>
        <div className='col-12 col-sm-12 col-md-10 col-lg-10 calendar-plot'>
          { calendarType === 'today' &&
            <DayPilotCalendar
              ref={calendarReference}
              headerDateFormat="dddd dd.MM.yyyy"
              startDate={pilotSelectedDate}
              showAllDayEvents={true}
              allDayEnd={"Date"}
              onEventClick={(args) => {
                handleClickCalendarEvent(args.e.data)
              }}
            />
          }
          { calendarType === '3days' &&
            <DayPilotCalendar
              ref={calendarReference}
              headerDateFormat="dddd dd.MM.yyyy"
              startDate={pilotSelectedDate}
              viewType="Days"
              days={3}
              showAllDayEvents={true}
              allDayEnd={"Date"}
              onEventClick={(args) => {
                handleClickCalendarEvent(args.e.data)
              }}
            />
          }
          { calendarType === 'week' &&
            <DayPilotCalendar
              ref={calendarReference}
              headerDateFormat="dddd dd.MM.yyyy"
              startDate={pilotSelectedDate}
              viewType="Week"
              weekStarts={1} // Week starts on Monday
              showAllDayEvents={true}
              allDayEnd={"Date"}
              onEventClick={(args) => {
                handleClickCalendarEvent(args.e.data)
              }}
            />
          }
        </div>
      </div>
      <CalendarEventPopup
        defaultDate={(new Date(props.currentDate.year, props.currentDate.month, props.currentDate.day + 1, 15)).toISOString().slice(0, 16)}
        newEvent={newEvent}
        event={eventData}
        calendarEventPopupOpen={calendarEventPopupOpen}
        setCalendarEventPopupOpen={setCalendarEventPopupOpen}
        currentTeamId={props.currentTeamId}
        currentUserId={props.currentUserId}
        getCalendarEvents={getCalendarEvents}
        invitableUsers={props.invitableUsers}
      />
      <CalendarTaskPopup
        defaultDate={(new Date(props.currentDate.year, props.currentDate.month, props.currentDate.day + 1, 15)).toISOString().slice(0, 16)}
        task={eventData}
        calendarTaskPopupOpen={calendarTaskPopupOpen}
        setCalendarTaskPopupOpen={setCalendarTaskPopupOpen}
        teamTask={props.currentTeamId}
      />
    </div>
  )
}

export default CalendarPage

CalendarPage.propTypes = {
  currentDate: PropTypes.object,
  userCalendar: PropTypes.bool,
  currentUserId: PropTypes.number,
  currentTeamId: PropTypes.number,
  invitableUsers: PropTypes.array,
  availableFilters: PropTypes.object
}