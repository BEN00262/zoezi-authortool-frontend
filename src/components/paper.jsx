import React,{useState,useContext,useEffect} from "react";
import {Button,Header,Transition,Segment,Label,Pagination } from "semantic-ui-react";
import {motion} from 'framer-motion';

import QuestionComp from "./question";
import { PaperContext } from "../context/paperContext";
import StatusComp from "./StatusComp";


const CAN_REVIEW = "can:review";


const Paper = ({fetched_questions=[], pageCount,setCurrectActivePage, currentActivePage}) => {
    const {authToken
        ,createNotification
        ,paperID
        ,setIsSample
        ,changePaperID
        ,removePaper
        ,paperName
        ,fetchPapers
        ,isSubmitted
        ,submitPaperDispatch
        ,approveQuestionDispatch
        ,removeQuestionDispatch
        ,socket_io_id,
        paperType
        ,roles} = useContext(PaperContext);

    const check_role = (role_required) => roles.includes(role_required);
    const isReviewer = check_role(CAN_REVIEW);
    
    const [isHidden,setIsHidden] = useState(new Array(fetched_questions.length).fill(true));

    const [paperQuestions,setPaperQuestions] = useState([]);
    const [is_submitted,setIsSubmitted] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setPaperQuestions(fetched_questions);
        setIsSubmitted(isSubmitted);
    },[]);

    useEffect(() => {
        setPaperQuestions(fetched_questions);
    },[fetched_questions]);


    useEffect(() => {

    },[isSubmitted]);

    // set a fetch stuff here on click of the pagination thingy
    const handlePageSwitch = (e, {activePage}) => {
        setCurrectActivePage(activePage);
    }

    const updatePaperContent = (new_question,index) => {
        let local_paper_copy = [...paperQuestions];
        local_paper_copy[index] = new_question;
        setPaperQuestions(local_paper_copy);
    }

    const internalSetIsSample = (index,questionID,isSample) => {
        setIsSample(authToken, questionID, isSample)
            .then(status => {
                if (status) {
                    let local_paper_copy = [...paperQuestions];
                    local_paper_copy[index].isSample = isSample;
                    setPaperQuestions(local_paper_copy);
                }
            })
    }


    const addQuestion = (e) => {
        setPaperQuestions([...paperQuestions,null]);
    }

    const removeMyPaper = () => {
        let reply = window.confirm("are you sure?")

        if (!reply)
            return;

        removePaper(paperID,authToken)
            .then(({data}) => {
                if (data){
                    if (data.success){
                        createNotification("Success!!","success","Paper deleted successfully");
                        fetchPapers(authToken);
                        changePaperID(null);
                        return;
                    }
                    throw new Error(data.error);
                }
            })
            .catch(error => {
                createNotification("Error!!","danger",error.message);
            })
    }

    const removeQuestion = (questionId,index) => {
        let reply = window.confirm("are you sure?")

        if (!reply)
            return;
        let paperQuestionsCopy = [...paperQuestions];
        let question_object = paperQuestionsCopy[index];

        let cleanUpFunc = () => {
            paperQuestionsCopy.splice(index,1);
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

    const updateQuestionsState = (status,index) => {
        let paperQuestionsCopy = [...paperQuestions];
        let question_object = paperQuestionsCopy[index];
        question_object.status = status;
        setPaperQuestions([...paperQuestionsCopy]);
    }

    const submitForReviewAction = () => {
        submitPaperDispatch(socket_io_id,paperID,authToken)
            .then(({data}) => {
                if(data.success){
                    setIsActive(true);
                    createNotification("Success!","success",data.message);
                }else{
                    throw new Error("Failed to submit paper for review");
                }
            })
            .catch(error => {
                console.log(error);
                createNotification("Error!","danger",error.message);
            })
    }

    const approveAuthorQuestion = (id,index) => {
        approveQuestionDispatch(id,index,authToken)
            .then(({data}) => {
                if(data.success){
                    updateQuestionsState("approved",index)
                }else{
                    throw new Error("Failed to approve question");
                }
            })
            .catch(error => {
                createNotification("Error!","danger",error.message);
            });
    }

    const toggleQuestionVisibility = (index) => {
        let clone_state = [...isHidden];
        clone_state[index] = clone_state[index] ? !clone_state[index] : true;
        setIsHidden(clone_state)
    }

    return (
        <>
            <StatusComp isActive={isActive} setIsActive={setIsActive} setIsSubmitted={setIsSubmitted}/>
            <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1, duration:0.4 }}
            >      
                <div style={{marginBottom:"10px", borderBottom:"1px solid #dbdbdb", paddingBottom:"1px"}}>
                    <Button compact basic color="teal" disabled={is_submitted} onClick={addQuestion} content='create question' icon='add' labelPosition='right'/>
                    
                    <Button
                        compact
                        basic
                        color="orange" 
                        disabled={check_role(CAN_REVIEW) || is_submitted}
                        onClick={submitForReviewAction} 
                        content='submit paper' 
                        icon='send' 
                        labelPosition='right'/>

                    <Button
                        compact
                        basic
                        color="red"
                        disabled={is_submitted && !isReviewer}
                        onClick={removeMyPaper} 
                        content='delete paper' 
                        icon='trash alternate outline' 
                        labelPosition='right'/>

                    {isReviewer ? <Button
                        compact
                        basic
                        color="green"
                        
                        disabled={true}//{is_submitted && !isReviewer}
                        // onClick={removeMyPaper} 
                        content='approve paper' 
                        icon='thumbs up outline'
                        labelPosition='right'/>
                        : null }

                    <div style={{
                        margin:"5px"
                    }}>
                        {/* update this */}
                        <Label content={paperType}/>
                        <Label content={paperName}/>  
                    </div> 
                </div>
                

                
                <div style={{height:"85vh", overflowY:"scroll",paddingRight:"6px", paddingLeft:"4px"}} >
                    {paperQuestions.map((retrievedQuestion,index) => {
                        return (
                            <React.Fragment key={`question_${index}`}>
                                
                                    <Segment.Group horizontal compact>
                                        <Segment onClick={(x) => toggleQuestionVisibility(index)} style={{cursor:"pointer"}} color='orange'>
                                            <Header as='h3'>Question  {index + 1}</Header>
                                        </Segment>
                                        <Segment basic textAlign={"center"} color="green">
                                            <Label color='green'>
                                                {retrievedQuestion && retrievedQuestion.status ? retrievedQuestion.status.toUpperCase() : "ONGOING"}
                                            </Label>
                                        </Segment>
                                        <Segment basic textAlign={"right"} color='red'>
                                            {/* check if the paper is saved first */}
                                        {retrievedQuestion && (retrievedQuestion._id !== null) && check_role(CAN_REVIEW)? 
                                            <Button basic compact color="olive" 
                                                // disabled={retrievedQuestion && retrievedQuestion.isExposed} 
                                                icon 
                                                onClick={(e) => internalSetIsSample(index,retrievedQuestion && retrievedQuestion._id,(retrievedQuestion && !retrievedQuestion.isSample))}
                                                // update status za hii stuff pia
                                                // onClick={(e) => approveAuthorQuestion(retrievedQuestion && retrievedQuestion._id,index)} 
                                                content={retrievedQuestion && retrievedQuestion.isSample ? "remove sample": "set sample"}/> : null
                                        }
                                        {is_submitted && check_role(CAN_REVIEW)? 
                                            <Button basic compact color="orange" 
                                                disabled={retrievedQuestion && retrievedQuestion.isExposed} 
                                                icon 
                                                onClick={(e) => approveAuthorQuestion(retrievedQuestion && retrievedQuestion._id,index)} 
                                                content="Approve" icon="thumbs up alternate outline" labelPosition="right"/> : null
                                        }
                                            
                                            <Button compact basic color="red" disabled={isSubmitted && !isReviewer} onClick={(e) => removeQuestion(retrievedQuestion ? retrievedQuestion._id:null,index)} content="Delete" icon="trash alternate outline" labelPosition="right"/>
                                        
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
                    { pageCount > 1 ? <Pagination onPageChange={handlePageSwitch} defaultActivePage={currentActivePage} totalPages={pageCount} /> : null}
                </div>
            </motion.div>
        </>
    );
}

export default Paper;