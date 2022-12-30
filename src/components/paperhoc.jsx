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
        ,isRefreshing, isSpecialPaper, rootPaperName
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
            searchForQuestions(authToken,paperID,searchTerm, isSpecialPaper)
            .then(({ data }) => {
                if (data && data.success){
                    setPageCount(1);
                    setFetchedQuestions(data.paper.questions);
                }
            })
            .catch(error => {
                setError(error.message);
            })
        }
    },[searchTerm])

    // this is where we fetch the questions from the backend but we need a way to send special papers bana
    useEffect(() => {
        setIsLoading(true);

        // we are good sasa ( just pass the status if its a special paper and the server will handle it )
        fetchQuestions(paperID,authToken, isSpecialPaper, currentActivePage - 1)
            .then(({data}) => {
                setPageCount(data.pageCount);
                // console.log(data.paper);
                setFetchedQuestions(data.paper.questions);
                isSubmittedDispatch(data.paper.isSubmitted);

                // if this is a special paper we have different things
                // this has no submissions and stuff
                // we dont have an actual grade here --> we should pass group_name_key for special papers

                updatePaperDetails({
                    grade: isSpecialPaper ? rootPaperName : data.paper.grade ,
                    subject: data.paper.subject,

                    // we dont have the paper name for special papers
                    paperName: isSpecialPaper ?  data.paper.subject : data.paper.paperName,
                    paperType: isSpecialPaper ? "Special Paper" : data.paper.paperType
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