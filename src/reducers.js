import { LOGIN, SET_USERNAME } from "./actions";

const initialState = {
    username:""
};

export function ricebookApp(state = initialState, action) {
    switch (action.type) {
        case SET_USERNAME:
            
            return {
                ...state,
                username: action.username
            }
        default:
            return state;
    }
}