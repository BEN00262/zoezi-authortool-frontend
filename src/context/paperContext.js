import React,{createContext,useReducer} from "react";
import { store } from 'react-notifications-component';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { io } from "socket.io-client";

import {
    SET_SOCKETIO_ID,
    INVALIDATE_SOCKETIO_ID,
    SET_LOGIN_TOKEN,
    UNSET_LOGIN_TOKEN,
    UPDATE_IS_SUBMITTED,
    FETCH_PAPERS,
    CHANGE_CURRENT_PAPER_DETAILS,
    CHANGE_PAPER_ID,
    CREATE_PAPER
} from './actionTypes';
import reducer from "./reducer";

const verifyToken = () => {
    const token = localStorage.getItem("authToken");
    try{
        const { exp } = jwt_decode(token);
        if (Date.now() >= exp * 1000) {
            return null;
        }
        return token;
    }catch(error) {
        return null;
    }
}

axios.defaults.baseURL = "https://author-tool-backend.herokuapp.com"; // 'http://localhost:3500/';
const socketIO = io("https://admintool-rabbitmq-consumer.herokuapp.com/");// io("http://localhost:3600/");

let initialContext = {
    authToken:verifyToken(),
    roles:localStorage.getItem("roles") ? localStorage.getItem("roles").split(",") : [],
    isSubmitted:false,
    paperID:"",
    paperName:"",
    paperGrade:"",
    paperSubject:"",
    currentQuestions:[],
    papers:{},
    socket_io_id: null
};

export const PaperContext = createContext(initialContext);

const PaperProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialContext);

    socketIO.on('connect', () => {
        dispatch({
            type: SET_SOCKETIO_ID,
            payload: socketIO.id
        })
    })
    
    socketIO.on('disconnect',() => {
        dispatch({
            type: INVALIDATE_SOCKETIO_ID,
        })
    })

    const createNotification = (notificationTitle,notificationType,notificationMessage) => {
        store.addNotification({
            title: notificationTitle,
            message: notificationMessage,
            type: notificationType,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 2000,
              onScreen: true
            }
          });
    }

    const logoutDispatcher = () => {
        dispatch({
            type: UNSET_LOGIN_TOKEN
        });
    }

    const searchForQuestions = (authToken, paperID, searchTerm) => {
        return axios.get(`/search/${paperID}/${searchTerm}`,{
            headers: {
                AuthToken: authToken
            }
        });
    }

    const loginDispatch = (loginCreds) => {
        axios.post("/user/login",loginCreds)
            .then(({data}) => {
                if(data.success){
                    localStorage.setItem("authToken",data.token);
                    localStorage.setItem("roles",data.roles);
                    dispatch({
                        type: SET_LOGIN_TOKEN,
                        payload: {
                            token:data.token,
                            roles:data.roles
                        }
                    })
                    createNotification("Success!","success","Welcome");
                }else{
                    throw new Error("There was an error");

                }
            })
            .catch(error =>{
                createNotification("Error!","danger",error.message);
            })
    }

    const updatePaperDetails = (details) => {
        dispatch({
            type: CHANGE_CURRENT_PAPER_DETAILS,
            payload: {
                grade: details.grade,
                subject: details.subject
            }
        })
    }
    const isSubmittedDispatch = (condition) => {
        dispatch({
            type: UPDATE_IS_SUBMITTED,
            payload: condition
        })
    }

    const removeQuestionDispatch = (questionId,token) => {
        return axios.delete(`/remove-question/${questionId}`,{
            headers:{
                AuthToken:token
            }
        })
    }

    const fetchQuestions = (paperID,token, page_num = 0) => {
        return axios.get(`/paper-questions/${paperID}/${page_num}`,{
            headers:{
                AuthToken:token
            }
        });
    }

    const addQuestion = (questionSent,token) => {
        return axios.post("/create-question",questionSent,{
                headers:{
                    AuthToken:token
                }
            });
    }

    const changePaperID = (paperID) => {
        dispatch({
            type:CHANGE_PAPER_ID,
            payload:{
                paperID
            }
        })
    }

    const fetchPapers = (token) => {
        axios.get("papers",{
            headers:{
                AuthToken:token
            }
        })
        .then(({data}) => {
                if(data){
                    dispatch({
                        type:FETCH_PAPERS,
                        payload:data
                    })
                }else{
                    throw new Error("Failed to fetch papers");
                }
            })
        .catch(error => {
            createNotification("Error!","danger",error.message);
        })
    }

    const createPaperDispatch = (paper,token) =>{
        axios.post("create-paper",paper,{
            headers:{
                AuthToken:token
            }
        })
            .then(({data}) => {
                if(data.success){
                    dispatch({
                        type:CREATE_PAPER,
                        payload:data.paper
                    });
                    createNotification("Success!","success","Paper created successfully");
                }else{
                    data.errors.forEach(error => {
                        createNotification("Error!","error",error);
                    })
                }
            })
            .catch(error => {
                createNotification("Error!","danger",error.message);
            })
    }

    const submitPaperDispatch = (clientID,paperID,token) => {
        return axios.post("/submit-paper",{
            paperID,
            clientID
        },{
            headers:{
                AuthToken:token
            }
        });
    }

    const approveQuestionDispatch = (id,index,token) => {
        return axios.get(`approve-question/${id}`,{
            headers:{
                AuthToken:token
            }
        });
    }

    return(
        <PaperContext.Provider value={{
            paperID:state.paperID,
            papers:state.papers,
            authToken:state.authToken,
            paperGrade: state.paperGrade,
            paperSubject: state.paperSubject,
            updatePaperDetails,
            changePaperID,
            createPaperDispatch,
            fetchPapers,
            fetchQuestions,
            isSubmittedDispatch,
            addQuestion,
            searchForQuestions,
            removeQuestionDispatch,
            loginDispatch,
            approveQuestionDispatch,
            submitPaperDispatch,
            createNotification,
            logoutDispatcher,
            roles: state.roles,
            isSubmitted:state.isSubmitted,
            currentQuestions:state.currentQuestions,
            socketIO,
            socket_io_id: state.socket_io_id
        }}>
            {children}
        </PaperContext.Provider>
    );
}

export default PaperProvider;