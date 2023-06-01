import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";

const CalendarTaskPopup = (props) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [eventDeadline, setEventDeadline] = useState(props.defaultDate)

  const handleModalClose = () => {
    props.setCalendarTaskPopupOpen(false)
  }

  const setTaskData = () => {
    setName(props.task.name)
    setDescription(props.task.description)
    setEventDeadline(props.task.event_start)
  }

  useEffect(setTaskData, [props.task])

  return (
    <Modal show={props.calendarTaskPopupOpen} onHide={() => handleModalClose()} animation={false}>
      <Modal.Body>
        <div>
          <p>{name}</p>
          <p>{description}</p>
          <p>{`Deadline: ${eventDeadline}`}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleModalClose}>{'Back'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

CalendarTaskPopup.propTypes = {
  defaultDate: PropTypes.string,
  task: PropTypes.object,
  calendarTaskPopupOpen: PropTypes.bool,
  setCalendarTaskPopupOpen: PropTypes.func,
}

export default CalendarTaskPopup