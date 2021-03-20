import produce from "immer";
import {
    SET_SOCKETIO_ID,
    INVALIDATE_SOCKETIO_ID,
    SET_LOGIN_TOKEN,
    UPDATE_IS_SUBMITTED,
    FETCH_PAPERS,
    CHANGE_CURRENT_PAPER_DETAILS,
    CHANGE_PAPER_ID,
    CREATE_PAPER,
    UNSET_LOGIN_TOKEN
} from './actionTypes';

// update this file later 
const reducer = (state,action) => {
    switch(action.type){
        case SET_SOCKETIO_ID:
            return produce(state,newState => {
                newState.socket_io_id = action.payload;
            })
        case INVALIDATE_SOCKETIO_ID:
            return produce(state,newState => {
                newState.socket_io_id = null;
            })
        case SET_LOGIN_TOKEN:
            return produce(state,newState => {
                newState.authToken = action.payload.token;
                newState.roles = action.payload.roles;
            })
        case UNSET_LOGIN_TOKEN:
            return produce(state,newState => {
                newState.authToken = null;
                newState.roles = null;
            })
        case UPDATE_IS_SUBMITTED:
            return produce(state,draft => {
                draft.isSubmitted = action.payload;
            })
        case FETCH_PAPERS:
            return produce(state, newState => {
               newState.papers = [];
               action.payload.forEach(paper => {
                    if(!newState.papers[paper.paperType]){
                        newState.papers[paper.paperType] = {
                            papers:[]
                        };
                    }
                    newState.papers[paper.paperType].papers.push({name:paper.paperName,id:paper._id})
               })
            })
        case CHANGE_CURRENT_PAPER_DETAILS:
            return {
                ...state,
                paperGrade: action.payload.grade,
                paperSubject: action.payload.subject
            }
        case CHANGE_PAPER_ID:
            let myLocalState = {...state}
            myLocalState.paperID = action.payload.paperID;
            return myLocalState;

        case CREATE_PAPER:
            let localState = {...state,papers:{...state.papers}};

            localState.paperID = action.payload._id;
            localState.paperName = action.payload.paperName;

            localState.paperGrade = action.payload.grade;
            localState.paperSubject = action.payload.subject;
            
            if(!localState.papers[action.payload.paperType]){
                localState.papers[action.payload.paperType] = { papers:[] };
            }
            
            localState.papers[action.payload.paperType].papers.push({name:action.payload.paperName,id:action.payload._id});
            return localState;
        default:
            return state;
    }
}

export default reducer;