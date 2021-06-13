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
        ,isRefreshing
    } = useContext(PaperContext);
    
    const [fetchedQuestions,setFetchedQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState(null);
    const [pageCount,setPageCount] = useState(0);
    const [currentActivePage, setCurrectActivePage] = useState(1);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(() => {
        setCurrectActivePage(1);
    },[paperID]);

    useEffect(() => {
        if (searchTerm !== null){
            searchForQuestions(authToken,paperID,searchTerm)
            .then(({ data }) => {
                if (data && data.success){
                    setPageCount(1);
                    console.log(data);
                    setFetchedQuestions(data.paper.questions);
                }
            })
            .catch(error => {
                setError(error.message);
            })
        }
    },[searchTerm])

    useEffect(() => {
        setIsLoading(true);
        fetchQuestions(paperID,authToken, currentActivePage - 1)
            .then(({data}) => {
                setPageCount(data.pageCount);
                // console.log(data.paper);
                setFetchedQuestions(data.paper.questions);
                isSubmittedDispatch(data.paper.isSubmitted);

                updatePaperDetails({
                    grade: data.paper.grade,
                    subject: data.paper.subject,
                    paperName: data.paper.paperName,
                    paperType: data.paper.paperType
                });
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => { setIsLoading(false); })
    },[paperID, currentActivePage, isRefreshing]);

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

    console.log(
        fetchedQuestions[0]
    )
    
    return (
        <>
            <SearchForm  setSearchTerm={setSearchTerm}/>
            
            {/* we want to rerender the paper when the search term is applied here what do we do? */}
            <Paper
                fetched_questions={fetchedQuestions}
                pageCount={pageCount}
                setCurrectActivePage={setCurrectActivePage}
                currentActivePage={currentActivePage} 
            />
        </>
    )
}

export default PaperHOC;