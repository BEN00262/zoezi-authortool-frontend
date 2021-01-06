import React,{useState,useContext} from "react";
import SunEditor from 'suneditor-react';
import {Button,Icon,Form,Checkbox,Header} from "semantic-ui-react";


import SCard from './SCard';
import {PaperContext} from "../context/paperContext";

const Comprehension = ({questionType,retrievedQuestion,index}) => {
    const {addQuestion,authToken} = useContext(PaperContext);
    const [question,setQuestion] = useState(retrievedQuestion ? retrievedQuestion.question : "");

   const [innerQuestion,setInnerQuestion] = useState(retrievedQuestion ? retrievedQuestion.children : []);

   const saveQuestion = (e) => {
       e.preventDefault();
       let nQues = {
           questionType:retrievedQuestion ? retrievedQuestion.questionType :questionType,
           question,
           question_id: retrievedQuestion ? retrievedQuestion._id : null,
           children:innerQuestion
       }
       addQuestion(nQues,index,authToken);
   }

   const handleAddQuestion = (e) => {
       setInnerQuestion([...innerQuestion,{
           question:"",
           additionalInfo:"",
           options:[]
       }]);
   }

   const handleInnerQuestionInput = (e,index) => {
        let innerQues = [...innerQuestion];
        innerQues[index].question = e.target.value;
        setInnerQuestion(innerQues);
   }

   const handleAddInnerQuestionOptions = (event,index) => {
        let innerQues = [...innerQuestion];
        innerQues[index].options.push({
            option:"",
            isCorrect:false
        });

        setInnerQuestion(innerQues);
   }

   const handleAdditionalText = (event,index) => {
        let innerQues = [...innerQuestion];
        innerQues[index].additionalInfo = event.target.value;
        setInnerQuestion(innerQues);
   }

   const handleAddAdditionalInfo = (event,index) => {
        let innerQues = [...innerQuestion];
        innerQues[index].additionalInfo = " ";
        setInnerQuestion(innerQues);
   }

   const removeInnerQuestion = (index) => {
       let innerQues = [...innerQuestion];
       innerQues.splice(index,1);
       setInnerQuestion(innerQues);
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
            <Form.Field>
                <SunEditor  onChange={(content) => setQuestion(content) } setContents={question} enableToolbar={true}/>
            </Form.Field>

            <Form.Field>
                <Button primary onClick={handleAddQuestion} icon="add" content="Add Question" labelPosition="right"/>
            </Form.Field>

            {innerQuestion.map((iq,q_index) => {
                    return (
                        <SCard>
                        <Header as='h4'>Sub question {q_index + 1}</Header>
                        <Form.Field key={`inner_ques_${q_index}`}>
                            <Form.Field>
                                <Button color="red" onClick={(e) => removeInnerQuestion(q_index)} content="Delete" icon="trash alternate outline" labelPosition="right"/>
                            </Form.Field>
                            
                            <Form.Field>
                                <textarea onChange={(e) => handleInnerQuestionInput(e,q_index)} value={iq.question} type="text"/>
                            </Form.Field>

                            <Form.Field>
                                <Button primary onClick={(e) => handleAddInnerQuestionOptions(e,q_index)} icon="add" content="Add Option" labelPosition="right"/>
                            </Form.Field>
                            {iq.options.map(({option,isCorrect},index) => {
                                return (
                                    <Form.Field key={`option_${index}`}>
                                        <Form.Group widths="1" inline>
                                            <Form.Field>
                                                <Checkbox onClick={(e) => handleOptionSet(q_index,index)} defaultChecked={isCorrect}/>
                                            </Form.Field>
                                            <Form.Field>
                                                <input onChange={(e) => handleOptionsInput(e,q_index,index)} value={option} type="text"/>
                                            </Form.Field>

                                            <Button color="red" icon onClick={(e) => removeOption(q_index,index)}>
                                                <Icon name="trash alternate outline"/>
                                            </Button>
                                        </Form.Group>
                                    </Form.Field>
                                );
                            })}
                             <Form.Field>
                                <Button primary disabled={iq.additionalInfo?true:false} onClick={(e) => handleAddAdditionalInfo(e,q_index)} content="Add additional information" icon="add" labelPosition="right"/>
                            </Form.Field>
                            <Form.Field>
                                {iq.additionalInfo ? <textarea value={iq.additionalInfo} onChange={(e) => handleAdditionalText(e,q_index)}/>:null} 
                            </Form.Field>

                        </Form.Field>
                        </SCard>
                    );
                })}
            <Button color="green" content='Save Question' icon='save' labelPosition='right'/>
        </Form>
    );
}

export default Comprehension;