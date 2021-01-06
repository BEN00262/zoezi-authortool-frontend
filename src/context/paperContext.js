import React,{createContext,useReducer} from "react";

import reducer from "./reducer";
import axios from "axios";


axios.defaults.baseURL = 'http://localhost:4000';

// first fetch the token from the localstorage if it exists

let initialContext = {
    authToken:localStorage.getItem("authToken"),
    isAdmin:false,
    isSubmitted:false,
    paperID:"",
    paperName:"",
    currentQuestions:[],
    papers:{},
};

export const PaperContext = createContext(initialContext);

const PaperProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialContext);

    // have a login dispatch
    const loginDispatch = (token,isAdmin) => {
        localStorage.setItem("authToken",token);
        dispatch({
            type:"SET_LOGIN_TOKEN",
            payload:{
                token,
                isAdmin
            }
        })
    }

    const removeQuestionDispatch = (questionId,index,token) => {
        if(questionId){
            axios.delete(`/remove-question/${questionId}`,{
                headers:{
                    AuthToken:token
                }
            })
            .then(() => {
                dispatch({
                    type:"REMOVE_QUESTION",
                    payload:{
                        index
                    }
                })
            })
        }else{
            dispatch({
                type:"REMOVE_QUESTION",
                payload:{
                    index
                }
            })
        }
    }

    const addQuestion = (questionSent,index=0,token) => {
        questionSent.paperID = state.paperID;
        if(questionSent.question_id){
            // use the index to update a given question
            axios.post("update-question",questionSent,{
                headers:{
                    AuthToken:token
                }
            })
                .then(({data}) => {
                    dispatch({
                        type:"UPDATE_QUESTION",
                        payload: {
                            data,
                            index
                        }
                    })
                })
        }else{
            axios.post("create-question",questionSent,{
                headers:{
                    AuthToken:token
                }
            })
                .then(({data}) => {
                    dispatch({
                        type:"ADD_QUESTION",
                        payload: {
                            data,
                            index
                        }
                    })
                })
        }
    }
    // create dispatchers
    // we fetch the questions first then set the id afterwards
    const changePaperID = (paperID,token) => {
        axios.get(`paper-questions/${paperID}`,{
            headers:{
                AuthToken:token
            }
        })
            .then(({data}) => {
                dispatch({
                    type:"CHANGE_PAPER_ID",
                    payload:{
                        paperID:data._id,
                        currentQuestions:data.questions,
                        isSub:data.isSubmitted
                    }
                })
            })
            .catch(console.log) // dispatch an error later
    }

    const fetchPapers = (token) => {
        axios.get("papers",{
            headers:{
                AuthToken:token
            }
        }).then(({data}) => {
                dispatch({
                    type:"FETCH_PAPERS",
                    payload:data.papers
                })
            })
            .catch(console.log) // dispatch an error later
    }

    const createPaperDispatch = (paper,token) =>{
        axios.post("create-paper",paper,{
            headers:{
                AuthToken:token
            }
        })
            .then(({data}) => {
                dispatch({
                    type:"CREATE_PAPER",
                    payload:data
                })
            })
            .catch(console.log) // dispatch an error later
    }

    const addQuestionDispatch = () => {
        dispatch({
            type:"ADD_QUESTION_TO_STACK"
        })
    }

    const submitPaperDispatch = (paperID,token) => {
        axios.post("submit-paper",{
            paperID
        },{
            headers:{
                AuthToken:token
            }
        })
            .then(({data}) => {
                if(data.success){
                    // dispatch a refetch --> will optimize later
                    fetchPapers(token);
                }
                // inform the user that something went wrong
            })
            .catch(console.log) // dispatch an error later
    }

    const approveQuestionDispatch = (id,index,token) => {
        // approve the question here
        axios.get(`approve-question/${id}`,{
            headers:{
                AuthToken:token
            }
        })
            .then(({data}) => {
                if(data.success){
                    dispatch({
                        type:"APPROVE_QUESTION",
                        payload:{
                            data:data.data,
                            index
                        }
                    })
                }
            })
            .catch(console.log) // dispatch an error later
    }

    return(
        <PaperContext.Provider value={{
            paperID:state.paperID,
            papers:state.papers,
            authToken:state.authToken,
            changePaperID,
            createPaperDispatch,
            fetchPapers,
            addQuestion,
            addQuestionDispatch,
            removeQuestionDispatch,
            loginDispatch,
            approveQuestionDispatch,
            submitPaperDispatch,
            isSubmitted:state.isSubmitted,
            isAdmin:state.isAdmin,
            currentQuestions:state.currentQuestions,
        }}>
            {children}
        </PaperContext.Provider>
    );
}

export default PaperProvider;