import React,{useState,useContext,useEffect} from "react";
import {Button,Header,Transition,Segment,Label} from "semantic-ui-react";
import {motion} from 'framer-motion';

import QuestionComp from "./question";
import {PaperContext} from "../context/paperContext";


const CAN_REVIEW = "can:review";


// first we will fetch the already created questions from the database and then enable the use to create questions
const Paper = ({fetched_questions=[],is_submitted = false}) => {
    const {authToken
        ,createNotification
        ,paperID
        ,submitPaperDispatch
        ,approveQuestionDispatch
        ,removeQuestionDispatch
        ,fetchPapers
        ,roles} = useContext(PaperContext);

    const check_role = (role_required) => {
        return roles.includes(role_required);
    }

    const [isHidden,setIsHidden] = useState([]);
    const [paperQuestions,setPaperQuestions] = useState(fetched_questions);
    
    // useEffect(() => {
    //     fetchPapers(authToken);
    // },[]);

    const updatePaperContent = (new_question,index) => {
        let local_paper_copy = [...paperQuestions];
        local_paper_copy[index] = new_question;
        setPaperQuestions(local_paper_copy);
    }


    const addQuestion = (e) => {
        setPaperQuestions([...paperQuestions,null])
    }

    const removeQuestion = (questionId,index) => {

        // show something like a prompt before allowing this
        let paperQuestionsCopy = [...paperQuestions];
        let question_object = paperQuestionsCopy[index];

        let cleanUpFunc = () => {
            paperQuestionsCopy.splice(index,1);
            // console.log(paperQuestionsCopy);
            setPaperQuestions(paperQuestionsCopy);
            createNotification("Success!","success","Question removed successfully");
        }

        if(question_object){
            removeQuestionDispatch(questionId,authToken)
                .then(() => {
                    cleanUpFunc();
                })
                .catch(error => {
                    createNotification("Error!","error",error.message);
                })
        }else{
            cleanUpFunc();
        }
    }

    const submitForReviewAction = () => {
        submitPaperDispatch(paperID)
            .then(({data}) => {
                if(data.success){
                    createNotification("Success!","success","Paper Successfully submitted");
                    fetchPapers(authToken);
                }else{
                    throw new Error("Failed to submit paper for review");
                }
            })
            .catch(error => {
                createNotification("Error!","error",error.message);
            })
    }

    const approveAuthorQuestion = (id,index) => {
        approveQuestionDispatch(id,index,authToken)
            .then(({data}) => {
                if(data.success){
                    let paperQuestionsCopy = [...paperQuestions];
                    let question_object = paperQuestionsCopy[index];
                    question_object.status = "approved";
                    setPaperQuestions([...paperQuestionsCopy]);
                }else{
                    throw new Error("Failed to approve question");
                }
            })
            .catch(error => {
                createNotification("Error!","error",error.message);
            });
    }

    // a question should manage this for christ sake
    const toggleQuestionVisibility = (index) => {
        let clone_state = [...isHidden];
        clone_state[index] = clone_state[index] ? !clone_state[index] : true;
        setIsHidden(clone_state)
    }

    return (
        <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1, duration:0.4 }}
        >      
            <div style={{marginBottom:"20px"}}>
                <Button color="teal" disabled={is_submitted} onClick={addQuestion} content='create question' icon='add' labelPosition='right'/>
                
                <Button 
                    color="orange" 
                    disabled={check_role(CAN_REVIEW) || is_submitted}
                    onClick={submitForReviewAction} 
                    content='submit paper' 
                    icon='send' 
                    labelPosition='right'/>
            </div>

            
            <div style={{height:"100vh", overflowY:"scroll", marginTop:"10px", paddingRight:"10px", paddingLeft:"10px"}} >
                {paperQuestions.map((retrievedQuestion,index) => {
                    return (
                        <React.Fragment key={`question_${index}`}>
                            
                                <Segment.Group horizontal>
                                    <Segment onClick={(x) => toggleQuestionVisibility(index)} style={{cursor:"pointer"}} color='orange'>
                                        <Header as='h3'>Question  {index + 1}</Header>
                                    </Segment>
                                    <Segment basic textAlign={"center"} color="green">
                                        <Label color='green'>
                                            {retrievedQuestion && retrievedQuestion.status ? retrievedQuestion.status.toUpperCase() : "ONGOING"}
                                        </Label>
                                    </Segment>
                                    <Segment basic textAlign={"right"} color='red'>
                                    {is_submitted && check_role(CAN_REVIEW)? 
                                        <Button basic color="orange" 
                                            disabled={retrievedQuestion && retrievedQuestion.isExposed} 
                                            icon 
                                            onClick={(e) => approveAuthorQuestion(retrievedQuestion && retrievedQuestion._id,index)} 
                                            content="Approve" icon="thumbs up alternate outline" labelPosition="right"/> : null
                                    }
                                        
                                        <Button basic color="red" onClick={(e) => removeQuestion(retrievedQuestion ? retrievedQuestion._id:null,index)} content="Delete" icon="trash alternate outline" labelPosition="right"/>
                                    
                                    </Segment>
                                </Segment.Group>
                            
                            <Transition visible={isHidden[index] ? !isHidden[index] : true} animation='drop' duration={450}>
                                <div style={{marginBottom:"20px"}}>
                                    <QuestionComp key={`question_${index}`} updatePaperContent={updatePaperContent} retrievedQuestion={retrievedQuestion} index={index}/>
                                </div>
                            </Transition>

                        </React.Fragment>
                    );
                })}

            </div>
        </motion.div>
    );
}

export default Paper;