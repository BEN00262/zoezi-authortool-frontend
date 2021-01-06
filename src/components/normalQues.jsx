import React,{useState,useContext,useEffect} from "react";
import SunEditor from 'suneditor-react';
import {Button,Icon,Form,Checkbox} from "semantic-ui-react";

import {PaperContext} from "../context/paperContext";

const NormalQuestionComp = ({questionType,retrievedQuestion,index}) => {
    const {addQuestion,authToken} = useContext(PaperContext);

    // reduce the state to one item only

    retrievedQuestion = retrievedQuestion || {};

    const [question,setQuestion] = useState("");
    const [options,setOptions] = useState([]);
    const [additionalInfo,setAdditionalInfo] = useState("");

    /**
     * {
     *      question,
     *      options:[
     *          {
     *              isCorrect:Boolean,
     *              option:""
     *          }
     *      ],
     *      additionalInfo
     * }
     */
    // const [normalQuestion,setNormalQuestion] = useState(retrievedQuestion);

    useEffect(() => {
        let initialQuestion = retrievedQuestion && retrievedQuestion.question ? retrievedQuestion.question : "";    
        let initialOptions = retrievedQuestion && retrievedQuestion.options ?retrievedQuestion.options  : [];
        let initialAdditional = retrievedQuestion && retrievedQuestion.additionalInfo ? retrievedQuestion.additionalInfo : "";

        setQuestion(initialQuestion);
        setOptions(initialOptions);
        setAdditionalInfo(initialAdditional);
    },[retrievedQuestion]);

    const handleAddOptions = (e) => {
        e.preventDefault();
        // let localState = {...normalQuestion,option:[...normalQuestion.options]};
        // localState.push({option:"",isCorrect:false})
        // setNormalQuestion(localState)
        setOptions([...options,{option:"",isCorrect:false}]);
    }

    const handleOptionsInput = (e,index) => {
        let localOptions = [...options];
        localOptions[index].option = e.target.value;
        setOptions(localOptions);
    }

    const onOptionSet = (index) => {
        let localOptions = [...options];
        localOptions[index].isCorrect = !localOptions[index].isCorrect;
        setOptions(localOptions);
    }

    const removeOption = (event,index) => {
        event.preventDefault();
        let localOptions = [...options];
        localOptions.splice(index,1);
        setOptions(localOptions);
    }

    const handleAddAdditionalInfo = (e) => {
        e.preventDefault();

        setAdditionalInfo(" ");
    }

    const handleAdditionalText = (e) => {
        setAdditionalInfo(e.target.value);
    }

    const saveQuestion = (e) => {
        e.preventDefault();

        let createdQuestion = {
            questionType:retrievedQuestion ? retrievedQuestion.questionType :questionType,
            question_id: retrievedQuestion ? retrievedQuestion._id : null,
            question,
            options,
            additionalInfo:additionalInfo ? additionalInfo : ""
        }

        addQuestion(createdQuestion,index,authToken)
    }

    const handleImageUploadBefore = (files, info, uploadHandler) => {
        // uploadHandler is a function
        console.log(files, info)
    }

    return (
        <>
            <Form onSubmit={saveQuestion}>
            <Form.Field>
                <SunEditor autoFocus={true}   onChange={(content) => setQuestion(content) } setContents={question} showToolbar={true}  onImageUploadBefore={handleImageUploadBefore} enableToolbar={true}/>
            </Form.Field>
            <Form.Field>
                <Button primary onClick={handleAddOptions} icon="add" content="Add Option" labelPosition="right"/>
            </Form.Field>
            
                {options.map((foundOption,index) => {
                    return (
                        <Form.Field key={`option_${index}`}>
                            <Form.Group widths="1" inline>
                                <Form.Field>
                                    <Checkbox defaultChecked={retrievedQuestion && foundOption.isCorrect ? true : false} onClick={(e) => onOptionSet(index)}/>
                                </Form.Field>
                                <Form.Field>
                                    <input value={retrievedQuestion ? foundOption.option : null} onChange={(e) => handleOptionsInput(e,index)} type="text"/>
                                </Form.Field>

                                <Button basic color="red" icon onClick={(e) => removeOption(e,index)}>
                                    <Icon name="trash alternate outline"/>
                                </Button>
                            </Form.Group>
                        </Form.Field>
                    );
                })}
            
            <Form.Field>
                <Button primary disabled={additionalInfo?true:false} onClick={handleAddAdditionalInfo} content="Add additional information" icon="add" labelPosition="right"/>
            </Form.Field>
            <Form.Field>
               {additionalInfo ? <textarea value={additionalInfo} onChange={handleAdditionalText}/>:null} 
            </Form.Field>
            <Button color="green" content='Save Question' icon='save' labelPosition='right'/>
        </Form>
        </>
    );
}

export default NormalQuestionComp;