const initState = {
    authMessage: null,
    authLog: null,
    authError: null
}

export const authReducer = (state=initState, action)=>{
    // console.log(action?.type);
    switch(action.type){
        case 'LOGIN_SUCCESS': return {authMessage: action.type, authLog: 'You are successfully logged in' , authError:null } ;
        case 'LOGIN_ERROR': return {authMessage: action.type, authLog: action.err , authError:action.err } ;
        case 'LOGOUT_SUCCESS': return {authMessage: action.type, authLog: 'Logout Success' , authError:null } ;
        case 'LOGOUT_ERROR': return {authMessage: action.type, authLog: action.err , authError:action.err } ;
        case 'SIGNUP_SUCCESS': return {authMessage: action.type, authLog: 'SignUp Successful' , authError:null } ;
        case 'SIGNUP_ERROR': return {authMessage: action.type, authLog: action.err , authError:action.err } ;
        case 'LOGOUT_NOT_ADMIN_SUCCESS': return { authMessage:action.type, authLog:'You are not an admin', authError:'You are not an admin' }
        case 'AUTH_MESSAGE_RESET': return initState;
        default: return state;
    }
}