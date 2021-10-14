import React,{useState,useEffect,useContext} from "react";
import { Button, Form, Modal,Dropdown, Segment, Label, Checkbox, Message } from 'semantic-ui-react';
import TimePicker from 'reactjs-timepicker';

import axios from 'axios';
import { PaperContext } from '../context/paperContext';

const KcpePaper = () => {
    const { authToken, rootPaperID, createNotification } = useContext(PaperContext);
    const [open, setIsOpen] = useState(false);
    const [isPastpaper, setIsPastPaper] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [time, setTime] = useState("")
    const [isTimed, setIsTimed] = useState(false)

    const [gradeSelection,setGradeSelection] = useState([
        {key: "index_0", text: "Model Paper", value: "Model Paper"},
        {key: "index_1", text: "Past Paper", value: "Past Paper"}
    ]);

    const [availableSubjects,setAvailableSubjects] = useState([
        {key: "index_0", text: "Kiswahili", value: "Kiswahili"},
        {key: "index_1", text: "English", value: "English"}
    ]);

    const [errors, setErrors] = useState(null);
    const [displayError,setDisplayError] = useState(false);

    // kcpe papers are yeared and u cant create a paper twice if attempted the system will complain
    
    const [paper,setPaper] = useState({
        paperType:"",
        name_or_year:"",
        subject: ""
    });

    const setOpen = (value) => {
        setIsOpen(value);

        if (!value){
            setDisplayError(false);
            setErrors(null);
        }
    }

    const handleSubmit = () => {
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
                // check the data received and act upon it
                // just inform the person that a new folder has been created a given location
                if (!(data.status)){
                    throw new Error("Failed to create paper");
                }

                setIsOpen(false)
                createNotification("Success!", "success", "Paper created successfully");

                // we have the paper do stuff with it buana
                // we can open the paper or whatever
                console.log(data)
            })
            .catch(error => {

                createNotification("Error!", "danger", "Failed to create paper")
                setIsOpen(false)
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

    // kcpe papers by default are yeared the sample ones are not

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size="tiny"
      open={open}
      trigger={
        <Button content="kcpe past/model paper" style={{
            marginTop:"5px"
        }} icon='pencil alternate' fluid labelPosition="right" compact primary basic/>
      }
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