import React,{useContext,useEffect} from 'react';
import {Segment,Loader} from "semantic-ui-react";

import Paper from "./paper";
import {PaperContext} from "../context/paperContext";
import { useState } from 'react';

import SearchForm from "./SearchForm";


const PaperHOC = () => {
    const { 
        paperID,fetchQuestions,
        authToken,isSubmittedDispatch,
        updatePaperDetails,searchForQuestions
    } = useContext(PaperContext);
    
    const [fetchedQuestions,setFetchedQuestions] = useState({});
    const [pageCount,setPageCount] = useState(0);
    const [currentActivePage, setCurrectActivePage] = useState(1);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(() => {
        setCurrectActivePage(1);
    },[paperID]);

    const searchQuestionFromDB = (searchTerm) => {
        searchForQuestions(authToken,paperID,searchTerm)
            .then(({ data }) => {
                if (data && data.success){
                    setFetchedQuestions(data.paper);
                }
            })
    }

    useEffect(() => {
        setIsLoading(true);
        fetchQuestions(paperID,authToken, currentActivePage - 1)
            .then(({data}) => {
                setPageCount(data.pageCount);
                setFetchedQuestions(data.paper);
                isSubmittedDispatch(data.paper.isSubmitted);

                updatePaperDetails({
                    grade: data.paper.grade,
                    subject: data.paper.subject
                });
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
    },[paperID, currentActivePage]);

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
        <>
            <SearchForm  searchQuestionFromDB={searchQuestionFromDB}/>
            
            <Paper 
                fetched_questions={fetchedQuestions.questions} 
                isSubmitted={fetchedQuestions.isSubmitted}
                pageCount={pageCount}
                setCurrectActivePage={setCurrectActivePage}
                currentActivePage={currentActivePage} 
            />
        </>
    )
}

export default PaperHOC;