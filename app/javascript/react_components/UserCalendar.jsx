import React, { useState, useEffect }from 'react'
import { getAuthenticityToken, callAPI } from "./shared/helpers";
import PropTypes from 'prop-types'
import Calendar from "react-calendar";
import {DayPilot, DayPilotCalendar} from "daypilot-pro-react";

const UserCalendar = (props) => {
  const [calendarType, setCalendarType] = useState('today') // 1 -> today, 2 -> 3days, 3 -> week
  const [selectedDate, setSelectedDate] = useState(new Date(props.currentDate.year, props.currentDate.month, props.currentDate.day))
  const [pilotSelectedDate, setPilotSelectedDate] = useState(DayPilot.Date.today())

  const onChangeCalendarType = (e) => {
    setCalendarType(e.target.value)
  }

  const formatDate = (givenDate) => {
    let date = new Date(givenDate)
    const year = date.getFullYear().toString()
    let month = (date.getMonth() + 1).toString()
    let day = date.getDate().toString()
    if (month.length < 2){
      month = '0' + month
    }
    if (day.length < 2){
      day = '0' + day
    }

    return [year, month, day].join('-')
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
      <div className='calendar-type-container'>
        <div className='calendar-type'>
          <label className='calendar-type-label' htmlFor='today'>Today</label>
          <input className='calendar-type-button' type='radio' id='today' name='today' value='today' checked={calendarType === 'today'} onChange={onChangeCalendarType}/>
        </div>
        <div className='calendar-type'>
          <label className='calendar-type-label' htmlFor='3days'>3 Days</label>
          <input className='calendar-type-button' type='radio' id='3days' name='3days' value='3days' checked={calendarType === '3days'} onChange={onChangeCalendarType}/>
        </div>
        <div className='calendar-type'>
          <label className='calendar-type-label' htmlFor='week'>Week</label>
          <input className='calendar-type-button' type='radio' id='week' name='week' value='week' checked={calendarType === 'week'} onChange={onChangeCalendarType}/>
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