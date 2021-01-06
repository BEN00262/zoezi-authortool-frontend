import React,{useState} from "react";
import { Button, Header, Form,Checkbox, Modal } from 'semantic-ui-react'

const SModal = ({handleInputChange,createPaper}) => {
    const [open, setOpen] = useState(false)
    
    const handleSubmit = (e) => {
        createPaper();
        setOpen(false);
    }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size="tiny"
      open={open}
      trigger={<Button fluid color="brown" content='create paper' icon='pencil alternate' labelPosition='right'/>}
    >
      <Modal.Header>Paper creation</Modal.Header>
      <Modal.Content>
        <Form>
            <Form.Field>
                <label>Grade</label>
                <input placeholder='Grade' name="grade" onChange={handleInputChange}/>
            </Form.Field>
            <Form.Field>
                <label>Subject</label>
                <input placeholder='Subject' name="subject" onChange={handleInputChange} />
            </Form.Field>
            <Form.Field>
                <label>Paper Type</label>
                <input placeholder='Paper Type' name="paperType" onChange={handleInputChange}/>
            </Form.Field>
        </Form>

      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Create Paper"
          labelPosition='right'
          icon='checkmark'
          onClick={handleSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default SModal;