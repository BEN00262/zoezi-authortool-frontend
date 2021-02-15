import React,{useState} from "react";
import { Button, Form, Modal,Dropdown } from 'semantic-ui-react';

const options = [
  { key: 1, text: 'One', value: "one" },
  { key: 2, text: 'Two', value: "two" },
  { key: 3, text: 'KCPE', value: "kcpe" },
]

const DEFAULT_GRADE = "one";

const SModal = ({createPaper}) => {
    const [open, setOpen] = useState(false)
    
    const [paper,setPaper] = useState({
        grade:DEFAULT_GRADE,
        subject:"",
        paperType:""
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        createPaper(paper);
        setOpen(false);
    }

    const handleInputChange = (e) => {
        setPaper({...paper,[e.target.name]:e.target.value});
    }
    
    const handleGradeSelection = (_,{ value }) => {
        setPaper({
          ...paper,
          grade:value
        });
    }

    const handleOnClose = (e) => {
      e.preventDefault();
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
      <Modal.Header>New Paper</Modal.Header>
        <Modal.Content>
        <Form>
            <Form.Field>
                <label>Grade</label>
                <Dropdown
                        onChange={handleGradeSelection}
                        selection
                        fluid
                        defaultValue = {DEFAULT_GRADE}
                        options={options}
                        placeholder='Select Grade'
                    />
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
          <Button.Group>
            <Button color='black' onClick={handleOnClose}>Cancel</Button>
            <Button.Or />
            <Button onClick={handleSubmit} positive>Create Paper</Button>
          </Button.Group>
        </Modal.Actions>
    </Modal>
  )
}

export default SModal;