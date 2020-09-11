const initState = {
    categoryMessage: null,
    categoryLog: null,
    cateogryError: null
}

export const categoryReducer = (state=initState, action)=>{
    // console.log(action?.type);
    switch(action.type){
        case 'CATEGORY_UPDATE_IN_PROGRESS'  :
            return {categoryMessage: action.type, categoryLog: 'Updating...' , categoryError:null } ;
        case 'CATEGORY_UPDATE_SUCCESS'      : 
            return {categoryMessage: action.type, categoryLog: 'Update Successful!!' , categoryError:null } ;
        case 'CATEGORY_UPDATE_ERROR'               : 
            return {categoryMessage: action.type, categoryLog: 'Update Successful!!' , categoryError:action.err } ;
        case 'CATEGORY_ADD_IN_PROGRESS'  :
            return {categoryMessage: action.type, categoryLog: 'Updating...' , categoryError:null } ;
        case 'CATEGORY_ADD_SUCCESS'      : 
            return {categoryMessage: action.type, categoryLog: 'Update Successful!!' , categoryError:null } ;
        case 'CATEGORY_ADD_ERROR'               : 
            return {categoryMessage: action.type, categoryLog: 'Update Successful!!' , categoryError:action.err } ;
        case 'CATEGORY_DELETE_IN_PROGRESS'  :
                return {categoryMessage: action.type, categoryLog: 'Deleting...' , categoryError:null } ;
        case 'CATEGORY_DELETE_SUCCESS'      : 
            return {categoryMessage: action.type, categoryLog: 'Delete Successful!!' , categoryError:null } ;
        case 'CATEGORY_DELETE_ERROR'               : 
            return {categoryMessage: action.type, categoryLog: 'Delete Error!!' , categoryError:action.err } ;
        case 'CATEGORY_LOG_RESET': return initState;
        default: return state;
    }
}