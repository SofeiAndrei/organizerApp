import React, { useState, useEffect }from 'react'
import { getAuthenticityToken, callAPI } from "./shared/helpers";
import PropTypes from 'prop-types'
import Calendar from "react-calendar";
import {DayPilot, DayPilotCalendar} from "daypilot-pro-react";
import {formatDate} from "./shared/calendar_helper";

const UserCalendar = (props) => {
  const [calendarType, setCalendarType] = useState('today') // 1 -> today, 2 -> 3days, 3 -> week
  const [selectedDate, setSelectedDate] = useState(new Date(props.currentDate.year, props.currentDate.month, props.currentDate.day))
  const [pilotSelectedDate, setPilotSelectedDate] = useState(DayPilot.Date.today())

  const onChangeCalendarType = (e) => {
    setCalendarType(e.target.value)
  }

  const selectNewDate = (value) => {
    setSelectedDate(value)
    const newDate = new DayPilot.Date(formatDate(value))
    setPilotSelectedDate(newDate)
  }

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
      { calendarType === 'today' &&
        <DayPilotCalendar
          headerDateFormat="dddd dd.MM.yyyy"
          startDate={pilotSelectedDate}
        />
      }
      { calendarType === '3days' &&
        <DayPilotCalendar
          headerDateFormat="dddd dd.MM.yyyy"
          startDate={pilotSelectedDate}
          viewType="Days"
          days={3}
        />
      }
      { calendarType === 'week' &&
        <DayPilotCalendar
          headerDateFormat="dddd dd.MM.yyyy"
          startDate={pilotSelectedDate}
          viewType="Week"
        />
      }
    </div>
  )
}

export default UserCalendar

UserCalendar.propTypes = {
  currentDate: PropTypes.object
}