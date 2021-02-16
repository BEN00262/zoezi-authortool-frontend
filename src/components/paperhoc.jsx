import React,{useContext,useEffect} from 'react';
import {Segment,Loader} from "semantic-ui-react";

import Paper from "./paper";
import {PaperContext} from "../context/paperContext";
import { useState } from 'react';


const PaperHOC = () => {
    const { paperID,fetchQuestions,authToken,isSubmittedDispatch } = useContext(PaperContext);
    const [fetchedQuestions,setFetchedQuestions] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetchQuestions(paperID,authToken)
            .then(({data}) => {
                setFetchedQuestions(data);
                isSubmittedDispatch(data.isSubmitted);
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
    },[paperID]);

    if(isLoading){
        return (
            <div>
                <Segment>
                    <Loader active inline="centered">Fetching questions...</Loader>
                </Segment>
            </div>
        )
    }

    if (error){
        return (
            <Segment>
                Error fetching questions
            </Segment>
        );
    }

    
    return (
        <Paper fetched_questions={fetchedQuestions.questions} isSubmitted={fetchedQuestions.isSubmitted}/>
    )
}

export default PaperHOC;