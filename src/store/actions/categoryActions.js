export const updateCategoryAction  = (update)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        dispatch({type:'CATEGORY_UPDATE_IN_PROGRESS'});
        const firestore = getFirestore();
        return firestore.collection('categories').doc(update.docid).update(update.data)
        .then(()=>{dispatch({type:"CATEGORY_UPDATE_SUCCESS"})})
        .catch((err)=>{dispatch({type:"CATEGORY_UPDATE_ERROR", err: err.message})});
    }
}

export const deleteCategoryAction  = (docid)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        dispatch({type:'CATEGORY_DELETE_IN_PROGRESS'});
        const firestore = getFirestore();
        return firestore.collection('categories').doc(docid).delete()
        .then(()=>{dispatch({type:"CATEGORY_DELETE_SUCCESS"})})
        .catch((err)=>{dispatch({type:"CATEGORY_DELETE_ERROR", err: err.message})});
    }
}

export const addCategoryAction  = (data)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        dispatch({type:'CATEGORY_ADD_IN_PROGRESS'});
        const firestore = getFirestore();
        return firestore.collection('categories').add(data)
        .then(()=>{dispatch({type:"CATEGORY_ADD_SUCCESS"})})
        .catch((err)=>{dispatch({type:"CATEGORY_ADD_ERROR", err: err.message})});
    }
}

export const categoryLogResetAction  = (data)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        dispatch({type:'CATEGORY_LOG_RESET'});
    }
}