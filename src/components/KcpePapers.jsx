import React,{useState,useEffect,useContext} from "react";
import { Button, Form, Modal,Dropdown, Segment, Label, Checkbox, Message } from 'semantic-ui-react';
import TimePicker from 'reactjs-timepicker';

import axios from 'axios';
import { PaperContext } from '../context/paperContext';

const KcpePaper = () => {
    const { authToken, rootPaperID, createNotification,isSpecialPaperModalOpen,changeSpecialPaperModalVisibility  } = useContext(PaperContext);
    const [isPastpaper, setIsPastPaper] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [time, setTime] = useState("")
    const [isTimed, setIsTimed] = useState(false)

    // this should not be hardcoded
    const [gradeSelection,setGradeSelection] = useState([
        {key: "index_0", text: "Model Paper", value: "Model Paper"},
        {key: "index_1", text: "Past Paper", value: "Past Paper"}
    ]);

    // create suggesters for other things
    const supported_subjects = ["Kiswahili", "English", "Mathematics", "Science", "SST&CRE"]
    const [availableSubjects,setAvailableSubjects] = useState([]);

    const [errors, setErrors] = useState(null);
    const [displayError,setDisplayError] = useState(false);
    
    const [paper,setPaper] = useState({
        paperType:"",
        name_or_year:"",
        subject: ""
    });

    useEffect(() => {
        setAvailableSubjects(supported_subjects.map((subject, index) => ({
            key: `available_subject_${index}`,
            text: subject,
            value: subject
        })))
    }, [])

    const setOpen = (value) => {
        changeSpecialPaperModalVisibility(value);

        if (!value){
            setDisplayError(false);
            setErrors(null);
        }
    }

    const handleSubmit = () => {
        setIsLoading(true)
        let split_time = time.split(":")
        let duration = (((+split_time[0]) * 60) + (+split_time[1])) * 60000;

        const paperDescription = {
            ...paper,
            isTimed,
            duration,
            rootID: rootPaperID,
        }

        axios.post("/special-paper", paperDescription,{
            headers: { AuthToken: authToken }
        })
            .then(({data}) => {
                if (!(data.status)){
                    throw new Error("Failed to create paper");
                }
                createNotification("Success!", "success", "Paper created successfully");
            })
            .catch(error => {
                createNotification("Error!", "danger", "Failed to create paper")
            })
            .finally(() => {
                setIsLoading(false)
                changeSpecialPaperModalVisibility(false)
            })
    }

    const handleNameOrYearSelection = (e) => {
        setPaper(old => ({
            ...old,
            name_or_year: e.target.value
        }))
    }
    
    const handlePaperTypeSelection = (_,{ value }) => {
        setPaper(old => ({
          ...old,
          paperType:value
        }));

        setIsPastPaper(!(value.toLowerCase() === "model paper"))
    }

    const handleSubjectSelection = (_,{ value }) => {
        setPaper(old => ({
          ...old,
          subject:value
        }));
    }

  return (
    <Modal
      onClose={() => setOpen(false)}
      size="tiny"
      open={isSpecialPaperModalOpen}
    >
      <Modal.Header>KCPE model/past paper</Modal.Header>
        <Modal.Content>
            {displayError && errors ? <Segment style={{
                color:"red"
            }}>
                <Label icon="times" corner="right" onClick={e => setDisplayError(false)} color="red"/>
                {errors}
            </Segment> : null }
        <Form onSubmit={e => e.preventDefault()}>
            <Form.Field>
                <label>Paper Type</label>
                <Dropdown
                        onChange={handlePaperTypeSelection}
                        selection
                        fluid
                        options={gradeSelection}
                        placeholder='Select Paper Type'
                    />
            </Form.Field>
            <Form.Field>
                <label>{isPastpaper ? "Year" : "Paper Name"}</label>

                {isPastpaper ?
                    <input type="number" onChange={handleNameOrYearSelection} min="1986" max={(new Date()).getFullYear() - 1}/>
                    :
                    <input type="text" onChange={handleNameOrYearSelection}/>
                }


            </Form.Field>
            <Form.Field>
                <label>Subject</label>
                <Dropdown
                        onChange={handleSubjectSelection}
                        selection
                        fluid
                        options={availableSubjects}
                        placeholder='Select Subject'
                    />
            </Form.Field>

            <Message>
                <Form.Field>
                    <Checkbox value={isTimed} onChange={() => setIsTimed(old => !old)} label="Is Timed"/>
                </Form.Field>

                {isTimed ?
                    <Form.Field>
                        <TimePicker
                            onChange={setTime}
                            defaultTime={"00:00"}
                            inputVisible={true}
                            value={time}
                            isOpen={false}
                        />
                    </Form.Field>
                    : null }
            </Message>
            <Button type="button" loading={isLoading} primary content="Create Paper" fluid onClick={handleSubmit}/>
        </Form>
        </Modal.Content>
    </Modal>
  )
}

export default KcpePaper;