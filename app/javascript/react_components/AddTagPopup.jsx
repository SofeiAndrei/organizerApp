import React, {useState} from 'react'
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
import {getAuthenticityToken} from "./shared/helpers";
import TagSelector from "./TagSelector";

const AddTagPopup = (props) => {
  const [newTagName, setNewTagName] = useState("")
  const [selectedTag, setSelectedTag] = useState(props.availableTags[0])

  const resetForm = () => {
    console.log("I reset the form")
    setNewTagName('')
  }

  const createNewTag = async () => {
    const response = await fetch(`/api/user_todo_lists/${props.todoListId}/individual_task_tags`, {
      method: 'POST',
      body: JSON.stringify({
        individual_task_tag: {
          name: newTagName,
        }
      }),
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': "application/json"
      }})
    return response
  }

  const handleModalClose = () => {
    resetForm()
    props.setLoading(false)
    props.setTagModalOpen(false)
  }

  const onSave = () => {
    props.setLoading(true)
    console.log(selectedTag)
    if (selectedTag.id === 0){
      console.log(newTagName)
      let newTag
      if (newTagName.length >= 2 && newTagName.length <= 32) {
        console.log()
        console.log("name is good, very well")

        console.log("create the tag for the team")
        createNewTag()
          .then((response) => {
            if(response.ok){
              console.log("Tag saved successfully")
              return response.json()
            }
            else{
              throw new Error('Network response was not OK')
            }
          })
          .then((data) => {
            newTag = data
            console.log("wait for the response to be ok")
            console.log("Add the tag to the tags list")
            const newTags = [...props.tags, newTag]
            console.log(newTags)
            props.setTags(newTags)
            console.log(data)
          })
          .catch(error => {
            console.log(error)
          })

      } else {
        console.log("Show the user that the name is not good")
        console.log("empty or too long name, not good")
      }
    } else {
      console.log("Add the tag to the tags list")
      const newTags = [...props.tags, selectedTag]
      console.log(selectedTag)
      console.log(newTags)
      props.setTags(newTags)

      const newAvailableTags = props.availableTags.filter((availableTag) => availableTag.id !== selectedTag.id)
      props.setAvailableTags(newAvailableTags)

      setSelectedTag(newAvailableTags[0])
    }
    handleModalClose()
  }

  return (
    <Modal show={props.tagModalOpen} onHide={() => handleModalClose()} animation={false}>
      <Modal.Header>
        <Modal.Title>
          Add a new Tag
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='content'>
          <div>
            <label htmlFor="available_tags">Available Tags:</label>
            <TagSelector availableTags={props.availableTags} selectedTag={selectedTag}
                         setSelectedTag={setSelectedTag}/>
          </div>
          {selectedTag.id === 0 &&
            <div>
              <label htmlFor="new_tag">New Tag Name:</label>
              <input type='text' id='new_tag' value={newTagName} onChange={(e) => setNewTagName(e.target.value)}/>
            </div>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => handleModalClose()}>Cancel</Button>
        <Button onClick={() => onSave()}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}

AddTagPopup.propTypes = {
  tagModalOpen: PropTypes.bool,
  setTagModalOpen: PropTypes.func,
  availableTags: PropTypes.array,
  setAvailableTags: PropTypes.func,
  tags: PropTypes.array,
  setTags: PropTypes.func,
  todoListId: PropTypes.number,
  setLoading: PropTypes.func
}

export default AddTagPopup