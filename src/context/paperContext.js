import React,{createContext,useReducer} from "react";
import { store } from 'react-notifications-component';
import reducer from "./reducer";
import axios from "axios";
import jwt_decode from "jwt-decode";

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

axios.defaults.baseURL = 'http://localhost:3500';

// first fetch the token from the localstorage if it exists

let initialContext = {
    authToken:verifyToken(),
    roles:localStorage.getItem("roles") ? localStorage.getItem("roles").split(",") : [],
    isSubmitted:false,
    paperID:"",
    paperName:"",
    currentQuestions:[],
    papers:{},
};

export const PaperContext = createContext(initialContext);

const PaperProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialContext);

    const createNotification = (notificationTitle,notificationType,notificationMessage) => {
        console.log(notificationMessage);
        console.log(notificationTitle);
        console.log(notificationType);

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

    const loginDispatch = (loginCreds) => {
        axios.post("/user/login",loginCreds)
            .then(({data}) => {
                if(data.success){
                    localStorage.setItem("authToken",data.token);
                    localStorage.setItem("roles",data.roles);
                    dispatch({
                        type: "SET_LOGIN_TOKEN",
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
                createNotification("Error!","error",error.message);
            })
    }

    const removeQuestionDispatch = (questionId,token) => {
        return axios.delete(`/remove-question/${questionId}`,{
            headers:{
                AuthToken:token
            }
        })
    }

    const fetchQuestions = (paperID,token) => {
        return axios.get(`/paper-questions/${paperID}`,{
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
            type:"CHANGE_PAPER_ID",
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
                        type:"FETCH_PAPERS",
                        payload:data
                    })
                }else{
                    throw new Error("Failed to fetch papers");
                }
            })
        .catch(error => {
            console.log(error);
            // createNotification("Error!","error",error.message);
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
                        type:"CREATE_PAPER",
                        payload:data.paper
                    });
                    createNotification("Success!","success","Paper created successfully");
                }else{
                    console.log(data)
                    data.errors.forEach(error => {
                        createNotification("Error!","error",error);
                    })
                }
            })
            .catch(error => {
                console.log(error);
                createNotification("Error!","error",error.message);
            })
    }

    const addQuestionDispatch = () => {
        dispatch({
            type:"ADD_QUESTION_TO_STACK"
        })
    }

    const submitPaperDispatch = (paperID,token) => {
        return axios.post("/submit-paper",{
            paperID
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
            changePaperID,
            createPaperDispatch,
            fetchPapers,
            fetchQuestions,
            addQuestion,
            addQuestionDispatch,
            removeQuestionDispatch,
            loginDispatch,
            approveQuestionDispatch,
            submitPaperDispatch,
            createNotification,
            roles: state.roles,
            isSubmitted:state.isSubmitted,
            currentQuestions:state.currentQuestions,
        }}>
            {children}
        </PaperContext.Provider>
    );
}

export default PaperProvider;