import React, {useEffect, useState} from 'react'
import PropTypes from "prop-types";

import { Modal, Button} from 'react-bootstrap'

const ViewProjectTaskPopup = (props) => {
  if(props.viewProjectTaskModalOpen) {
    const [name, setName] = useState(props.data.task.name)
    const [description, setDescription] = useState(props.data.task.description)
    const [priority, setPriority] = useState(props.data.task.priority)
    const [deadline, setDeadline] = useState(props.data.task.deadline)
    const [status, setStatus] = useState(props.data.task.status)

    const [assignee, setAssignee] = useState(props.data.assignee)

    console.log(name)
    console.log(props.data)
    const handleModalClose = () => {
      props.setViewProjectTaskModalOpen(false)
    }

    const changesHaveBeenMade = () => {
      return name !== props.data.task.name ||
        description !== props.data.task.description ||
        priority !== props.data.task.priority ||
        deadline !== props.data.task.deadline ||
        status !== props.data.task.status ||
        assignee !== props.data.assignee
    }

    return (
      <Modal show={props.viewProjectTaskModalOpen} onHide={() => handleModalClose()} animation={false}>
        <Modal.Header>
          <Modal.Title>
            {name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='content'>
            <div>
              <label htmlFor="name">Name:</label>
              <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleModalClose()}>Cancel</Button>
          <Button className={changesHaveBeenMade() ? '' : 'hidden'} onClick={() => handleModalClose()}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

ViewProjectTaskPopup.propTypes = {
  viewProjectTaskModalOpen: PropTypes.bool,
  setViewProjectTaskModalOpen: PropTypes.func,
  data: PropTypes.object,
  teamMembers: PropTypes.array,
  getTasks: PropTypes.func,
}

export default ViewProjectTaskPopup