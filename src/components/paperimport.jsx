import React,{useState,useEffect,useContext} from "react";
import { Button, Form, Modal,Dropdown, Segment, Label } from 'semantic-ui-react';
import axios from 'axios';
import { PaperContext } from '../context/paperContext';

const PaperImport = () => {
    const { authToken, createNotification, fetchPapers } = useContext(PaperContext);
    const [open, setIsOpen] = useState(false);
    const [isLoading,setIsLoading] = useState(false);

    const [gradeSelection,setGradeSelection] = useState([]);
    const [errors, setErrors] = useState(null);
    const [displayError,setDisplayError] = useState(false);
    
    const [paper,setPaper] = useState({
        grade:"",
        paperType:"",
        excelFile: null
    });

    const setOpen = (value) => {
        setIsOpen(value);

        if (!value){
            setDisplayError(false);
            setErrors(null);
        }
    }

    useEffect(() => {
      axios.get("/user/metadata",{
        headers:{
            AuthToken:authToken
        }
      })
        .then(({ data }) => {
          setGradeSelection(
            data.contentCanDo.map((x,index) => ({ key: `${x.grade}_${index}`, text: x.grade, value: x.grade}))
          );
        })
        .catch(error => {
            setErrors(error.message);
            setDisplayError(true);
        })

    },[]);

    const handleSubmit = () => {
        setDisplayError(false);
        setErrors(null);
        setIsLoading(true);

        const formData = new FormData();
        
        Object.entries(paper).filter(([x,_]) => x !== 'excelFile').forEach(([key,value]) => {
            formData.append(key,value);
        })
        formData.append("excelFile",paper.excelFile,paper.excelFile.name)

        // submit the data the paper here
        axios.post('/import-excel-paper',formData,{
            headers:{ AuthToken:authToken }
        })
            .then(({ data }) => {
                if (data){
                    if (data.success){
                        setOpen(false);
                        createNotification("Success!","success","Imported data successfully");
                        fetchPapers(authToken);
                        return;
                    }
                    throw new Error(data.error);
                }
            })
            .catch(error => {
                setErrors(error.message);
                setDisplayError(true);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    
    const handleGradeSelection = (_,{ value }) => {
        setPaper({
          ...paper,
          grade:value
        });
    }

    const handleExcelFileSelection = (e) => {
        setPaper({
            ...paper,
            excelFile: e.target.files[0]
        })
    }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size="tiny"
      open={open}
      trigger={
        <Button content="import excel" style={{
            marginTop:"5px"
        }} icon="upload" fluid labelPosition="right" compact primary basic/>
      }
    >
      <Modal.Header>Import Excel File</Modal.Header>
        <Modal.Content>
            {displayError && errors ? <Segment style={{
                color:"red"
            }}>
                <Label icon="times" corner="right" onClick={e => setDisplayError(false)} color="red"/>
                {errors}
            </Segment> : null }
        <Form onSubmit={e => e.preventDefault()}>
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
                <label>Excel file</label>
               <input type="file" onChange={handleExcelFileSelection}/>
            </Form.Field>
            <Button type="button" loading={isLoading} primary content="Upload file" fluid onClick={handleSubmit}/>
        </Form>
        </Modal.Content>
    </Modal>
  )
}

export default PaperImport;