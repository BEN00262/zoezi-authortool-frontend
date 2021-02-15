import produce from "immer";


const reducer = (state,action) => {
    switch(action.type){
        case "APPROVE_QUESTION":{
            let localState = {...state,currentQuestions:[...state.currentQuestions]};
            localState.currentQuestions[action.payload.index] = action.payload.data;
            return localState;
        }
        case "SET_LOGIN_TOKEN":
            return produce(state,newState => {
                newState.authToken = action.payload.token;
                newState.roles = action.payload.roles;
            })
        case "UPDATE_QUESTION":
            return produce(state,newState => {
                newState.currentQuestions[action.payload.index] = action.payload.data;
            })
        case "REMOVE_QUESTION":
            return produce(state,newState => {
                newState.currentQuestions.splice(action.payload.index,1);
            })
        case "ADD_QUESTION_TO_STACK":
            // improve on this
            return {
                ...state,
                currentQuestions:[...state.currentQuestions,null]
            }
        case "FETCH_PAPERS":
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
        case "CHANGE_PAPER_ID":
            let myLocalState = {...state}
            myLocalState.paperID = action.payload.paperID;
            return myLocalState;

        case "CREATE_PAPER":
            let localState = {...state,papers:{...state.papers}};

            localState.paperID = action.payload._id;
            localState.paperName = action.payload.paperName;
            
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