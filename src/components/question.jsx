import React,{useState,useContext} from "react";
import {Form,Label,Segment} from "semantic-ui-react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

import SCard from './SCard';
import NormalQuestionComp from "./normalQues";
import Comprehension from "./comprehension";

const QuestionComp = ({retrievedQuestion,index}) => {
    const [questionType,setQuestionType] = useState(retrievedQuestion ? retrievedQuestion.questionType : "normal");

    const handleQuestionTypeChange = (e) => {
        setQuestionType(e.target.value);
    }

    const renderComp = (condition) => {
        switch(condition){
            case 'normal':
                return <NormalQuestionComp questionType={condition}/>
            case "comprehension":
                return <Comprehension questionType={condition}/>
        }
    }

    const renderAllreadyFilled =  (question,index) => {
        switch(question.questionType){
            case 'normal':
                return <NormalQuestionComp retrievedQuestion={retrievedQuestion} index={index}/>
            case "comprehension":
                return <Comprehension retrievedQuestion={retrievedQuestion} index={index}/>
        }
    }

    return (
        <SCard>
            <Form style={{marginBottom:"10px"}}>
                <Label color='green' ribbon='right'>
                    {retrievedQuestion ? retrievedQuestion.status.toUpperCase() : "ONGOING"}
                </Label>
                <Form.Field>
                    <label htmlFor="questionType">Select the question type</label>

                    <select id="questionType" value={questionType} onChange={handleQuestionTypeChange}>
                        <option value="normal">normal</option>
                        <option value="comprehension">comprehension</option>
                    </select>
                </Form.Field>
            </Form>
            
            {retrievedQuestion ? renderAllreadyFilled(retrievedQuestion,index) : renderComp(questionType)}
          
        </SCard>
    );
}

export default QuestionComp;