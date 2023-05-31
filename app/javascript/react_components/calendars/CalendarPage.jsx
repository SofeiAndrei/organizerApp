import React, { useState, useEffect }from 'react'
import { getAuthenticityToken, callAPI } from "../shared/helpers";
import PropTypes from 'prop-types'
import Calendar from "react-calendar";
import {DayPilot, DayPilotCalendar} from "daypilot-pro-react";
import {formatDate} from "../shared/calendar_helper";

const CalendarPage = (props) => {
  const [calendarType, setCalendarType] = useState('today') // 1 -> today, 2 -> 3days, 3 -> week
  const [selectedDate, setSelectedDate] = useState(new Date(props.currentDate.year, props.currentDate.month, props.currentDate.day))
  const [pilotSelectedDate, setPilotSelectedDate] = useState(DayPilot.Date.today())
  const [calendarReference, setCalendarReference] = useState(React.createRef())
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false)
  const [events, setEvents] = useState([])

  const getTasks = () => {
    const url = props.userCalendar ?
      `/api/users/${props.currentUserId}/calendar_filtered_events` :
      `/api/teams/${props.currentTeamId}/calendar_filtered_events`

    console.log(url)
    callAPI(url, 'GET')
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

  useEffect(getTasks, [])
  useEffect(() => {calendar().update({events})})

  return (
    <div>
      <div>
        <Calendar onChange={selectNewDate}/>
        {`Selected Date: ${selectedDate.toDateString()}`}
        <br/>
      </div>
      <div className='radio-button-group-container'>
        <div className='radio-button-div'>
          <label className='radio-label' htmlFor='today'>Today</label>
          <input className='radio-button' type='radio' id='today' name='today' value='today' checked={calendarType === 'today'} onChange={onChangeCalendarType}/>
        </div>
        <div className='radio-button-div'>
          <label className='radio-label' htmlFor='3days'>3 Days</label>
          <input className='radio-button' type='radio' id='3days' name='3days' value='3days' checked={calendarType === '3days'} onChange={onChangeCalendarType}/>
        </div>
        <div className='radio-button-div'>
          <label className='radio-label' htmlFor='week'>Week</label>
          <input className='radio-button' type='radio' id='week' name='week' value='week' checked={calendarType === 'week'} onChange={onChangeCalendarType}/>
        </div>
      </div>
      <button
        className='btn btn-primary'>
        Create Event
      </button>
      { calendarType === 'today' &&
        <DayPilotCalendar
          ref={calendarReference}
          headerDateFormat="dddd dd.MM.yyyy"
          startDate={pilotSelectedDate}
          showAllDayEvents={true}
          allDayEnd={"Date"}
          // onTimeRangeSelected={args => {
          //   calendar().message("Selected range: " + args.start.toString("hh:mm tt") + " - " + args.end.toString("hh:mm tt"));
          // }}
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
        />
      }
    </div>
  )
}

export default CalendarPage

CalendarPage.propTypes = {
  currentDate: PropTypes.object,
  userCalendar: PropTypes.bool,
  currentUserId: PropTypes.number,
  currentTeamId: PropTypes.number
}