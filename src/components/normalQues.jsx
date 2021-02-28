import React,{useState,useEffect} from "react";
import SunEditor from 'suneditor-react';
import {Button,Icon,Form,Checkbox} from "semantic-ui-react";

import Topic from './topic';

const QUESTION_TYPE = "normal";
const EDITOR_OPTIONS = [
    ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
    ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
    ['image', 'fullScreen', 'showBlocks', 'preview']
];

// use the index to change the question's content on save or updating
const NormalQuestionComp = ({saveQuestionToDatabase,retrievedQuestion = {},index,isSubmitted = false}) => {
    const [question,setQuestion] = useState("");
    const [topic,setTopic] = useState({
        topic:" ",
        subTopic:" "
    });
    const [options,setOptions] = useState([]);
    const [additionalInfo,setAdditionalInfo] = useState("");

    useEffect(() => {
        let initialQuestion = retrievedQuestion && retrievedQuestion.question ? retrievedQuestion.question : "";    
        let initialOptions = retrievedQuestion && retrievedQuestion.options ?retrievedQuestion.options.map(({option,isCorrect}) => {
            return {option,isCorrect};
        })  : [];
        let initialAdditional = retrievedQuestion && retrievedQuestion.additionalInfo ? retrievedQuestion.additionalInfo : "";
        
        let initialTopicAndSubtopic = retrievedQuestion && retrievedQuestion.topic ? {
            topic: retrievedQuestion.topic,
            subTopic: retrievedQuestion.subTopic
        } : {
            topic:" ",
            subTopic:" "
        };

        setTopic(initialTopicAndSubtopic);
        setQuestion(initialQuestion);
        setOptions(initialOptions);
        setAdditionalInfo(initialAdditional);
    },[]);

    const handleSetTopic = (e) => {
        setTopic({
            ...topic,
            [e.target.name]:e.target.value
        });
    }

    const handleAddOptions = (e) => {
        e.preventDefault();
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

    const handleAdditionalTextE = (text) => {
        setAdditionalInfo(text);
    }

    const saveQuestion = (e) => {
        e.preventDefault();

        let createdQuestion = {
            questionType: QUESTION_TYPE,
            question_id: retrievedQuestion ? retrievedQuestion._id : null,
            question,
            options_next:options,
            topic: topic.topic,
            subTopic: topic.subTopic,
            additionalInfo:additionalInfo ? additionalInfo : ""
        }

        saveQuestionToDatabase(createdQuestion,index);
    }

    return (
        <>
            <Form onSubmit={saveQuestion}>
            <Topic handleTopicAndSubject={handleSetTopic} topic={topic.topic} subtopic={topic.subTopic}/>
            <Form.Field>
                <SunEditor autoFocus={true}  setOptions={{
                      buttonList : EDITOR_OPTIONS,
                }} onChange={(content) => setQuestion(content) } setContents={question} showToolbar={true} enableToolbar={true}/>
            </Form.Field>
            <Form.Field>
                <Button primary disabled={isSubmitted} onClick={handleAddOptions} icon="add" content="Add Option" labelPosition="right"/>
            </Form.Field>
            
                {options.map((foundOption,index) => {
                    return (
                        <Form.Field key={`option_${index}`}>
                            <Form.Group widths="1" inline>
                                <Form.Field>
                                    <Checkbox disabled={isSubmitted} defaultChecked={retrievedQuestion && foundOption.isCorrect ? true : false} onClick={(e) => onOptionSet(index)}/>
                                </Form.Field>
                                <Form.Field>
                                    <input value={retrievedQuestion ? foundOption.option : null} onChange={(e) => handleOptionsInput(e,index)} type="text"/>
                                </Form.Field>

                                <Button basic color="red" disabled={isSubmitted} icon onClick={(e) => removeOption(e,index)}>
                                    <Icon name="trash alternate outline"/>
                                </Button>
                            </Form.Group>
                        </Form.Field>
                    );
                })}
            
            <Form.Field>
                <Button primary disabled={(additionalInfo?true:false) || isSubmitted } onClick={handleAddAdditionalInfo} content="Add additional information" icon="add" labelPosition="right"/>
            </Form.Field>
            <Form.Field>
               {additionalInfo ? 
                    <SunEditor autoFocus={true}  setOptions={{
                        buttonList : EDITOR_OPTIONS,
                  }} onChange={(content) => handleAdditionalTextE(content) } setContents={additionalInfo} showToolbar={true} enableToolbar={true}/>
                    :null
                } 
            </Form.Field>
            <Button color="green" content='Save Question' disabled={isSubmitted} icon='save' labelPosition='right'/>
        </Form>
        </>
    );
}

export default NormalQuestionComp;