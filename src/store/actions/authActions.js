import { authReducer } from "../reducers/authReducer";

export const initAction = ()=>{
    return (dispatch, getState,{ getFirebase, getFirestore} ) =>{
        const firebase = getFirebase();
        var checkIsAdmin =  setInterval(()=>{
            const profile = getState().firebase.profile ?? {};
            // console.log('profile=>',profile);
            if(profile?.isLoaded){
                if(profile.isAdmin){
                    dispatch({type: "LOGIN_SUCCESS"})
                }else{
                    dispatch(notAdminLogoutAction())
                }
                clearInterval(checkIsAdmin);
                // dispatch(authMessageResetAction());
            }
        },200);
        setTimeout(()=>{ 
            clearInterval(checkIsAdmin);
            const profile = getState().firebase.profile ?? {};
            if(!profile.isLoaded){
                dispatch(authMessageResetAction());
            }
         },5000)
    }
}

export const loginAction = (credentials)=>{
    return (dispatch, getState,{ getFirebase, getFirestore} ) =>{
        const firebase = getFirebase();
        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
            )
            .then(()=>{
                var checkIsAdmin =  setInterval(()=>{
                    const profile = getState().firebase.profile ?? {};
                    console.log('profile=>',profile);
                    if(profile.isLoaded){
                        if(profile.isAdmin){
                            dispatch({type: "LOGIN_SUCCESS"})
                        }else{
                            dispatch(notAdminLogoutAction())
                        }
                        clearInterval(checkIsAdmin)
                    }
                },200);
                setTimeout(()=>{ clearInterval(checkIsAdmin) },5000)
            })
            .catch(err=>{
                console.log(err);
                dispatch({
                    type: "LOGIN_ERROR",
                    err: err.message
                })
           })
    }
}

export const logoutAction = ()=>{
    // console.log('logout request');
    return (dispatch, getState,{ getFirebase, getFirestore })=>{
        const firebase = getFirebase();
        return firebase.auth().signOut()
        .then(()=>{ 
            // console.log('logout successful');
            dispatch({type:'LOGOUT_SUCCESS'}) 
        })
        .catch(err=>{
            dispatch({
                type: "LOGOUT_ERROR",
                err: err.message
            })
        })
    }
}

export const notAdminLogoutAction = ()=>{
    // console.log('logout request');
    return (dispatch, getState,{ getFirebase, getFirestore })=>{
        const firebase = getFirebase();
        return firebase.auth().signOut()
        .then(()=>{ 
            // console.log('logout successful');
            dispatch({type:'LOGOUT_NOT_ADMIN_SUCCESS'}) 
        })
        .catch(err=>{
            dispatch({
                type: "LOGOUT_NOT_ADMIN_ERROR",
                err: err.message
            })
        })
    }
}

export const signupAction = (newUser)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        
        const firebase = getFirebase();
        const firestore = getFirestore();
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((resp)=>{
            return firestore.collection('users').doc(resp.user.uid).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                initials: newUser.firstName[0]+newUser.lastName[0],
                isAdmin: true
            })
        })
        .then(()=>{ dispatch({ type:"SIGNUP_SUCCESS" }) })
        .catch((err)=>{ dispatch({ type:"SIGNUP_ERROR", err:err.message }) })
    }
}

export const signUpExistsAction = (user) =>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        
        const firebase = getFirebase();
        const firestore = getFirestore();
        return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((resp)=>{
            // console.log('resp', resp.user.uid);
            return firestore.collection('users').doc(resp.user.uid).update({
                isAdmin: true
            })
        })
        .then(()=>{ dispatch({ type:"SIGNUP_SUCCESS" }) })
        .catch((err)=>{ 
            // console.log(err);
            dispatch({ type:"SIGNUP_ERROR", err:err.message }) 
            dispatch(notAdminLogoutAction());
        })
    }
}

export const  authMessageResetAction = ()=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        return dispatch({ type:'AUTH_MESSAGE_RESET' })
    }
}