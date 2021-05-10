import React,{useState, useCallback, useContext} from "react";
import SunEditor from 'suneditor-react';
import {Button,Form,Checkbox,Header} from "semantic-ui-react";

import Topic from './topic';
import SCard from './SCard';
import {PaperContext} from '../context/paperContext';

const COMPREHENSION_QUESTION = "comprehension";
const EDITOR_OPTIONS = [
    ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
    ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
    ['image', 'fullScreen', 'showBlocks', 'preview']
];
const CAN_REVIEW = "can:review";

const Comprehension = ({saveQuestionToDatabase,retrievedQuestion,index,isSubmitted = false}) => {
    const { roles } = useContext(PaperContext);
    const check_role = useCallback((role_required) => roles.includes(role_required),[roles]);
    const isReviewer = check_role(CAN_REVIEW)

    const [question,setQuestion] = useState(retrievedQuestion ? retrievedQuestion.question : "");
    const [topic,setTopic] = useState(retrievedQuestion && retrievedQuestion.topic ? {
        topic: retrievedQuestion.topic,
        subTopic: retrievedQuestion.subTopic
    } : {
        topic:" ",
        subTopic:" "
    });

   const [innerQuestion,setInnerQuestion] = useState(retrievedQuestion ? retrievedQuestion.children.map(({options,...rest})=> {
        return {
            ...rest,
            options:options.map(({option,isCorrect}) => {
                return {option,isCorrect}
            })
        }
   }) : []);

   const saveQuestion = (e) => {
       e.preventDefault();
       let comprehension_question = {
           questionType:COMPREHENSION_QUESTION,
           question,
           question_id: retrievedQuestion ? retrievedQuestion._id : null,
           children:innerQuestion,
           topic: topic.topic,
           subTopic: topic.subTopic,
       }

       saveQuestionToDatabase(comprehension_question,index);
   }

   const handleAddQuestion = (e) => {
       e.preventDefault();
       setInnerQuestion([...innerQuestion,{
           question:"",
           additionalInfo:"",
           options:[]
       }]);
   }

   const handleInnerQuestionInputE = (text,index) => {
        let innerQues = [...innerQuestion];
        innerQues[index].question = text;
        setInnerQuestion(innerQues);
    }

   const handleAddInnerQuestionOptions = (event,index) => {
        event.preventDefault();

        let innerQues = [...innerQuestion];

        innerQues[index].options.push({
            option:"",
            isCorrect:false
        });

        setInnerQuestion(innerQues);
   }

   const handleAdditionalTextE = (text,index) => {
    let innerQues = [...innerQuestion];
    innerQues[index].additionalInfo = text;
    setInnerQuestion(innerQues);
   }

   const handleAddAdditionalInfo = (event,index) => {
       event.preventDefault();
        let innerQues = [...innerQuestion];
        innerQues[index].additionalInfo = " ";
        setInnerQuestion(innerQues);
   }

   const removeInnerQuestion = (index) => {
       let innerQues = [...innerQuestion];
       innerQues.splice(index,1);
       setInnerQuestion(innerQues);
   }

   const handleSetTopic = (e) => {
        setTopic({
            ...topic,
            [e.target.name]:e.target.value
        });
    }

   const handleOptionSet = (parentIndex,index) => {
        // find the index of inner question then the index of the option and do it
        let innerQues = [...innerQuestion];
        innerQues[parentIndex].options[index].isCorrect = !innerQues[parentIndex].options[index].isCorrect;
        setInnerQuestion(innerQues);
   }


   const handleOptionsInput = (event,parentIndex,index) => {
        // find the index of inner question then the index of the option and do it
        let innerQues = [...innerQuestion];
        innerQues[parentIndex].options[index].option = event.target.value;
        setInnerQuestion(innerQues);
   }

   const removeOption = (parentIndex,index) => {
        // find the index of inner question then the index of the option and do it
        let innerQues = [...innerQuestion];
        innerQues[parentIndex].options.splice(index,1);
        setInnerQuestion(innerQues);
   }


    return (
        <Form onSubmit={saveQuestion}>
            <Topic handleTopicAndSubject={handleSetTopic} topic={topic.topic} subtopic={topic.subTopic}/>
            <Form.Field>
            <SunEditor autoFocus={true}  setOptions={{
                      buttonList :EDITOR_OPTIONS,
                }} onChange={(content) => setQuestion(content) } setContents={question} showToolbar={true} enableToolbar={true}/>
            </Form.Field>

            <Form.Field>
                <Button circular disabled={isSubmitted} primary onClick={handleAddQuestion} icon="add" content="Add Question" labelPosition="right"/>
            </Form.Field>

            {innerQuestion.map((iq,q_index) => {
                    return (
                        <SCard key={`innerQuestion_${q_index}`}>
                        <Header as='h4'>Sub question {q_index + 1}</Header>
                        <Form.Field key={`inner_ques_${q_index}`}>
                            <Form.Field>
                                <Button type="button" circular disabled={isSubmitted} basic color="red" onClick={(e) => removeInnerQuestion(q_index)} content="Delete" icon="trash alternate outline" labelPosition="right"/>
                            </Form.Field>
                            
                            <Form.Field>
                                {/* <textarea onChange={(e) => handleInnerQuestionInput(e,q_index)} value={iq.question} type="text"/> */}
                                <SunEditor autoFocus={true}  setOptions={{
                                    buttonList :EDITOR_OPTIONS,
                              }} onChange={(content) => handleInnerQuestionInputE(content,q_index) } setContents={iq.question} showToolbar={true} enableToolbar={true}/>
                            </Form.Field>

                            <Form.Field>
                                <Button type="button" circular disabled={isSubmitted && !isReviewer} primary onClick={(e) => handleAddInnerQuestionOptions(e,q_index)} icon="add" content="Add Option" labelPosition="right"/>
                            </Form.Field>
                            {iq.options.map(({option,isCorrect},index) => {
                                return (
                                    <Form.Field key={`option_${index}`}>
                                        <Form.Group widths="1" inline>
                                            <Form.Field>
                                                <Checkbox disabled={isSubmitted && !isReviewer} onClick={(e) => handleOptionSet(q_index,index)} defaultChecked={isCorrect}/>
                                            </Form.Field>
                                            <Form.Field>
                                                <input  onChange={(e) => handleOptionsInput(e,q_index,index)} value={option} type="text"/>
                                            </Form.Field>

                                            <Button type="button" circular icon="superscript" compact basic color="teal"/>
                                            <Button type="button" circular compact disabled={isSubmitted && !isReviewer} basic color="red" icon="trash alternate outline" onClick={(e) => removeOption(q_index,index)}/>
                                        </Form.Group>
                                    </Form.Field>
                                );
                            })}
                             <Form.Field>
                                <Button type="button" circular primary disabled={(iq.additionalInfo?true:false) || (isSubmitted && !isReviewer)} onClick={(e) => handleAddAdditionalInfo(e,q_index)} content="Add additional information" icon="add" labelPosition="right"/>
                            </Form.Field>
                            <Form.Field>
                                {iq.additionalInfo ? 
                                <SunEditor autoFocus={true}  setOptions={{
                                    buttonList :EDITOR_OPTIONS,
                              }} onChange={(content) => handleAdditionalTextE(content,q_index) } setContents={iq.additionalInfo} showToolbar={true} enableToolbar={true}/>
                                :null} 
                            </Form.Field>

                        </Form.Field>
                        </SCard>
                    );
                })}
            <Button circular color="green" disabled={isSubmitted && !isReviewer} content='Save Question' icon='save' labelPosition='right'/>
        </Form>
    );
}

export default Comprehension;