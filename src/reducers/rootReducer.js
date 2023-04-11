const initialState = {
    auth: {},
    currentUser: {},
    users: {},
    messages: {}
}

export default function rootReducer (state = initialState, action) {
    switch(action.type) {
        case "UPDATE_AUTH_DB":
            return {
                ...state,
                auth: action.payload.auth,
                db: action.payload.db
            }
        case "UPDATE_USERS":
            return {
                ...state,
                users: action.payload
            }
        case "UPDATE_MESSAGES":
            return {
                ...state,
                messages: action.payload
            }
        case "UPDATE_CURRENTUSER":
            return {
                ...state,
                currentUser: action.payload
            }
        default:
            return state
    }
}

