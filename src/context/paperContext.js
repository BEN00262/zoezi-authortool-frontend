import React, { createContext, useReducer } from "react";
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
    CHANGE_SPECIAL_PAPER_ID,
    CREATE_PAPER,
    IS_REFRESHING,
    CHANGE_ROOT_PAPER_ID,
    IS_SPECIAL_PAPER_MODAL_OPEN
} from './actionTypes';
import reducer from "./reducer";

const verifyToken = () => {
    try {
        const token = localStorage.getItem("authToken");
        const { exp } = jwt_decode(token);
        return Date.now() >= exp * 1000 ? null : token;
    } catch (error) {
        return null;
    }
}

// "https://author-tool-backend.herokuapp.com";
axios.defaults.baseURL = 'http://localhost:3500/';
// io("https://admintool-rabbitmq-consumer.herokuapp.com/");
const socketIO = io("https://admintool-rabbitmq-consumer.herokuapp.com/"); // io("http://localhost:3600/");

let initialContext = {
    authToken: verifyToken(),
    // remember to package this in the token and actually to verify them
    roles: localStorage.getItem("roles") ? localStorage.getItem("roles").split(",") : [],
    isSubmitted: false,
    isSpecialPaper: false,
    isSpecialPaperModalOpen: false,
    rootPaperID: "", // used by special papers only
    rootPaperName: "", // for special papers only ( I should seriously think about this design .... later though )
    paperID: "",
    paperName: "",
    paperGrade: "",
    paperSubject: "",
    paperType: "",
    currentQuestions: [],
    papers: {},
    spapers: {},
    socket_io_id: null,
    isRefreshing: false
};

// we also have special papers
export const PaperContext = createContext(initialContext);

const PaperProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialContext);

    // find a way for listening for the login credential

    socketIO.on('connect', () => {
        dispatch({
            type: SET_SOCKETIO_ID,
            payload: socketIO.id
        })
    })

    socketIO.on('disconnect', () => {
        dispatch({
            type: INVALIDATE_SOCKETIO_ID,
        })
    })

    const createNotification = (notificationTitle, notificationType, notificationMessage) => {
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

    const changeSpecialPaperModalVisibility = (state) => {
        dispatch({
            type: IS_SPECIAL_PAPER_MODAL_OPEN,
            payload: state
        })
    }

    const removePaper = (paperID, authToken) => {
        return axios.delete(`/remove-paper/${paperID}`, {
            headers: { AuthToken: authToken }
        });
    }

    const logoutDispatcher = () => {
        dispatch({
            type: UNSET_LOGIN_TOKEN
        });
    }

    const searchForQuestions = (authToken, paperID, searchTerm) => {
        return axios.get(`/search/${paperID}?${searchTerm}`, {
            headers: { AuthToken: authToken }
        });
    }

    const setIsSample = (authToken, questionID, isSample) => {
        return axios.post(`/set-sample/${questionID}`, { isSample }, {
                headers: { AuthToken: authToken }
            })
            .then(({ data }) => {
                if (data.success) {
                    createNotification("Success!", "success", "Question set/removed as sample");
                    return data.success
                }

                throw new Error("Failed to set question as sample");
            })
            .catch(error => {
                createNotification("Error!", "danger", error.message);
                return false
            })
    }

    // special paper change root id dispatcher
    const changeRootPaperID = (rootPaperID, rootPaperName) => {
        dispatch({
            type: CHANGE_ROOT_PAPER_ID,
            payload: {
                rootPaperID,
                rootPaperName
            }
        })
    }

    const loginDispatch = (loginCreds) => {
        axios.post("/user/login", loginCreds)
            .then(({ data }) => {
                if (data.success) {
                    localStorage.setItem("authToken", data.token);
                    localStorage.setItem("roles", data.roles);
                    dispatch({
                        type: SET_LOGIN_TOKEN,
                        payload: {
                            token: data.token,
                            roles: data.roles
                        }
                    })
                    createNotification("Success!", "success", "Welcome");
                } else {
                    throw new Error("There was an error");

                }
            })
            .catch(error => {
                createNotification("Error!", "danger", error.message);
            })
    }

    const updatePaperDetails = details => {
        dispatch({
            type: CHANGE_CURRENT_PAPER_DETAILS,
            payload: {
                grade: details.grade,
                subject: details.subject,
                paperName: details.paperName,
                paperType: details.paperType
            }
        })
    }
    const isSubmittedDispatch = (condition) => {
        dispatch({
            type: UPDATE_IS_SUBMITTED,
            payload: condition
        })
    }

    const removeQuestionDispatch = (questionId, token) => {
        return axios.delete(`/remove-question/${questionId}`, {
            headers: {
                AuthToken: token
            }
        })
    }

    const fetchQuestions = (paperID, token, is_special_paper = false, page_num = 0) => {
        // we need an indication if its a special paper
        return axios.get(`/paper-questions/${paperID}/${is_special_paper}/${page_num}`, {
            headers: {
                AuthToken: token
            }
        });
    }

    const addQuestion = (questionSent, token, is_special = false) => {
        return axios.post(`/create-question/${is_special}`, questionSent, {
            headers: {
                AuthToken: token
            }
        });
    }

    // CHANGE_SPECIAL_PAPER_ID
    const changeSpecialPaperID = (paperID) => {
        dispatch({
            type: CHANGE_SPECIAL_PAPER_ID,
            payload: {
                paperID
            }
        })
    }

    // change the status of the isSpecial tag to false ( this is a regular paper )
    const changePaperID = (paperID) => {
        dispatch({
            type: CHANGE_PAPER_ID,
            payload: {
                paperID
            }
        })
    }

    const fetchPapers = (token) => {
        axios.get("papers", {
                headers: {
                    AuthToken: token
                }
            })
            .then(({ data }) => {
                if (data) {
                    dispatch({
                        type: FETCH_PAPERS,
                        payload: data
                    })
                } else {
                    throw new Error("Failed to fetch papers");
                }
            })
            .catch(error => {
                createNotification("Error!", "danger", error.message);
            })
    }

    const setIsRefreshingDispatch = (status) => {
        dispatch({
            type: IS_REFRESHING,
            payload: status
        })
    }

    // try to use the same tactic to create the special papers then dispatch the event
    // now the event will fire to fetchPaper which fetches only the other type of papers

    // here we create a paper
    const createPaperDispatch = (paper, token) => {
        axios.post("create-paper", paper, {
                headers: {
                    AuthToken: token
                }
            })
            .then(({ data }) => {
                if (data.success) {
                    dispatch({
                        type: CREATE_PAPER,
                        payload: data.paper
                    });
                    createNotification("Success!", "success", "Paper created successfully");
                } else {
                    data.errors.forEach(error => {
                        createNotification("Error!", "danger", error);
                    })
                }
            })
            .catch(error => {
                createNotification("Error!", "danger", error.message);
            })
    }

    const submitPaperDispatch = (clientID, paperID, token) => {
        return axios.post("/submit-paper", {
            paperID,
            clientID
        }, {
            headers: {
                AuthToken: token
            }
        });
    }

    const approveQuestionDispatch = (id, index, token) => {
        return axios.get(`approve-question/${id}`, {
            headers: {
                AuthToken: token
            }
        });
    }

    const fetchAdminGrades = AuthToken => {
        return axios.get(`admin/grades`, {
            headers: { AuthToken }
        })
    }

    return ( 
        <PaperContext.Provider value = {
            {
                rootPaperID: state.rootPaperID,
                rootPaperName: state.rootPaperName,
                isSpecialPaper: state.isSpecialPaper,
                isSpecialPaperModalOpen: state.isSpecialPaperModalOpen,
                paperID: state.paperID,
                papers: state.papers,
                spapers: state.spapers,
                paperName: state.paperName,
                authToken: state.authToken,
                paperGrade: state.paperGrade,
                paperSubject: state.paperSubject,
                paperType: state.paperType,
                changeSpecialPaperModalVisibility,
                changeRootPaperID,
                updatePaperDetails,
                changeSpecialPaperID,
                changePaperID,
                createPaperDispatch,
                fetchPapers,
                fetchQuestions,
                setIsSample,
                isSubmittedDispatch,
                addQuestion,
                searchForQuestions,
                removeQuestionDispatch,
                loginDispatch,
                approveQuestionDispatch,
                submitPaperDispatch,
                createNotification,
                logoutDispatcher,
                removePaper,
                setIsRefreshingDispatch,
                fetchAdminGrades,
                roles: state.roles,
                isSubmitted: state.isSubmitted,
                currentQuestions: state.currentQuestions,
                socketIO,
                socket_io_id: state.socket_io_id,
                isRefreshing: state.isRefreshing
            }
        } > { children } </PaperContext.Provider>
    );
}

export default PaperProvider;