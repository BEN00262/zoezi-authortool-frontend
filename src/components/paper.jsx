import React,{useState,useContext} from "react";
import {Button,Header} from "semantic-ui-react";

import QuestionComp from "./question";
import {PaperContext} from "../context/paperContext";


// first we will fetch the already created questions from the database and then enable the use to create questions
const Paper = () => {
    // we use the current questions
    const {currentQuestions
        ,isSubmitted
        ,removeQuestionDispatch
        ,authToken,paperID
        ,addQuestionDispatch
        ,approveQuestionDispatch
        ,isAdmin,submitPaperDispatch} = useContext(PaperContext);
    //const [questions,setQuestions] = useState([new Array(currentQuestions.length)]);
    
    const addQuestion = (e) => {
        addQuestionDispatch();
    }

    const removeQuestion = (questionId,index) => {
        // let localQuestions = [...questions];
        // localQuestions.splice(index,1);
        // setQuestions(localQuestions);
        removeQuestionDispatch(questionId,index);
    }

    const submitForReviewAction = () => {
        // this should add the question to the admin's review board
        submitPaperDispatch(paperID,authToken);
    }

    const approveAuthorQuestion = (id,index) => {
        // id is the id of the question
        // index is its position in the current state ---> for live reupdates
        approveQuestionDispatch(id,index,authToken);
    }

    return (
        <div>
            
            <div style={{marginBottom:"20px"}}>
            <Button color="teal" disabled={isSubmitted} onClick={addQuestion} content='create question' icon='add' labelPosition='right'/>
            
            {isAdmin || isSubmitted ? null : <Button color="orange" 
                onClick={submitForReviewAction} 
                content='submit paper' 
                icon='send' 
                labelPosition='right'/>}
            </div>
            
            <div>
                {currentQuestions.map((retrievedQuestion,index) => {
                    return (
                        <React.Fragment key={`question_${index}`}>
                            <Header as='h3'>Question {index + 1}</Header>
                            <div style={{marginBottom:"20px"}}>
                                <Button color="red" onClick={(e) => removeQuestion(retrievedQuestion ? retrievedQuestion._id:null,index)} content="Delete" icon="trash alternate outline" labelPosition="right"/>
                                
                                {isSubmitted && isAdmin ? <Button color="orange" disabled={retrievedQuestion && retrievedQuestion.isExposed} icon onClick={(e) => approveAuthorQuestion(retrievedQuestion && retrievedQuestion._id,index)} content="Approve" icon="thumbs up outline" labelPosition="right"/> : null}
                                <QuestionComp key={`question_${index}`} retrievedQuestion={retrievedQuestion} index={index}/>
                            </div>
                        </React.Fragment>
                    );
                })}

            </div>
        </div>
    );
}

export default Paper;