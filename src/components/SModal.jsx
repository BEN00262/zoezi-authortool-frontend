import React,{useState,useEffect,useContext} from "react";
import { Button, Form, Modal,Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import { PaperContext } from '../context/paperContext';

const SModal = ({createPaper}) => {
    const { authToken,createNotification } = useContext(PaperContext);
    const [open, setOpen] = useState(false);

    const [gradeSelection,setGradeSelection] = useState([]);
    const [subjectSelection,setSubjectSelection] = useState({});
    const [paperTypeSelection,setPaperTypeSelection] = useState([]);
    const [displaySubjects,setDisplaySubjects] = useState([]);
    
    const [paper,setPaper] = useState({
        grade:"",
        subject:"",
        paperType:""
    });

    useEffect(() => {
      axios.get("/user/metadata",{
        headers:{
            AuthToken:authToken
        }
      })
        .then(({ data }) => {
          let paperTypesFetched = data.paperTypeCanDo.map((x,index) => {
            return { key: `${x.replaceAll(" ","")}_${index}`, text: x, value: x }
          })

          setPaperTypeSelection(paperTypesFetched);

          let gradesFetched = data.contentCanDo.map((x,index) => ({ key: `${x.grade}_${index}`, text: x.grade, value: x.grade}));
          setGradeSelection(gradesFetched);

          let subjectsMapping = data.contentCanDo.reduce((acc,current) => {
            acc[current.grade] = current.subjects.map((x,index) => ({key: `${x.replaceAll(" ","")}_${index}`, text: x, value: x}));
            return acc;
          },{});

          setSubjectSelection(subjectsMapping);
        })
        .catch(error => {
          setOpen(false);
          createNotification("Error!","danger",error.message);
        })

    },[]);

    const handleSubmit = (e) => {
        e.preventDefault();
        createPaper(paper);
        setOpen(false);
    }
    
    const handleGradeSelection = (_,{ value }) => {
        setPaper({
          ...paper,
          grade:value
        });
        setDisplaySubjects(subjectSelection[value]);
    }

    const handleSubjectSelection = (_,{ value }) => {
        setPaper({
          ...paper,
          subject:value
        });
    }

    const handlePaperTypeSelection = (_,{ value }) => {
        setPaper({
          ...paper,
          paperType:value
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
      trigger={<Button circular fluid color="grey" content='create paper' icon='pencil alternate' labelPosition='right'/>}
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
                        options={gradeSelection}
                        placeholder='Select Grade'
                    />
            </Form.Field>
            <Form.Field>
                <label>Subject</label>
                <Dropdown
                        onChange={handleSubjectSelection}
                        selection
                        fluid
                        options={displaySubjects}
                        placeholder='Select Subject'
                    />
            </Form.Field>
            <Form.Field>
                <label>Paper Type</label>
                <Dropdown
                        onChange={handlePaperTypeSelection}
                        selection
                        fluid
                        options={paperTypeSelection}
                        placeholder='Select Paper Type'
                    />
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