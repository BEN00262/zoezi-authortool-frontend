import React,{useState,useContext} from "react";
import {Form,Dropdown} from "semantic-ui-react";
import 'suneditor/dist/css/suneditor.min.css';

import SCard from './SCard';
import NormalQuestionComp from "./normalQues";
import Comprehension from "./comprehension";

import {PaperContext} from "../context/paperContext";


const NORMAL_QUESTION = "normal";
const COMPREHENSION_QUESTION = "comprehension";

const QuestionComp = ({updatePaperContent,retrievedQuestion = {},index}) => {
    const [questionType,setQuestionType] = useState(retrievedQuestion ? retrievedQuestion.questionType : NORMAL_QUESTION);

    const {authToken,paperID,createNotification,addQuestion} = useContext(PaperContext);

    const handleQuestionTypeChange = (_,{ value }) => {
        setQuestionType(value);
    }

    const saveQuestionToDatabase = (question,index) => {
        question.paperID = paperID;

        addQuestion(question,authToken)
            .then(({data}) => {
                if (data.success){
                    updatePaperContent(data.question,index);
                    createNotification("Success!!","success","Question created successfully");
                }else{
                    throw new Error("Failed to create/update question")
                }
            })
            .catch(error => {
                createNotification("Error!!","error",error.message);
            })

    }

    const renderComp = (condition) => {
        switch(condition){
            case NORMAL_QUESTION:
                return <NormalQuestionComp saveQuestionToDatabase={saveQuestionToDatabase}/>
            case COMPREHENSION_QUESTION:
                return <Comprehension saveQuestionToDatabase={saveQuestionToDatabase}/>
        }
    }

    const renderAllreadyFilled =  (question,index) => {
        switch(question.questionType){
            case NORMAL_QUESTION:
                return <NormalQuestionComp saveQuestionToDatabase={saveQuestionToDatabase} retrievedQuestion={retrievedQuestion} index={index}/>
            case COMPREHENSION_QUESTION:
                return <Comprehension saveQuestionToDatabase={saveQuestionToDatabase} retrievedQuestion={retrievedQuestion} index={index}/>
        }
    }

    const options = [
        { key: 1, text: 'Normal', value: 'normal' },
        { key: 2, text: 'Comprehension', value: 'comprehension' }
    ]

    return (
        <SCard>
            <Form style={{marginBottom:"10px"}}>
                <Form.Field>
                    <Dropdown
                        onChange={handleQuestionTypeChange}
                        selection
                        fluid
                        defaultValue = {retrievedQuestion && retrievedQuestion.questionType ? retrievedQuestion.questionType : "normal"}
                        options={options}
                        placeholder='Choose Question Type'
                    />

                </Form.Field>
            </Form>
            
            {retrievedQuestion ? renderAllreadyFilled(retrievedQuestion,index) : renderComp(questionType)}
          
        </SCard>
    );
}

export default QuestionComp;