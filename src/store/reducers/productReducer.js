const initState={
    productMessage: 'PRODUCT_UPDATE_RESET',
    productError: null,
    productLog: null
}

export const productReducer = (state = initState, action)=>{
    console.log(action?.type);
    switch(action.type){
        case 'PRODUCT_ADD_IN_PROGRESS': 
            return { productMessage: action.type, productLog:'Product Adding...', productError: null };
        case 'PRODUCT_ADD_SUCCESS': 
            return { productMessage: action.type, productLog:'Product Add Success', productError: null };
        case 'PRODUCT_ADD_ERROR': 
            return { productMessage: action.type, productLog:'Product Add Error', productError: action.err };
        case 'PRODUCT_SET_IN_PROGRESS': 
            return { productMessage: action.type, productLog:'Product Adding...', productError: null };
        case 'PRODUCT_SET_SUCCESS': 
            return { productMessage: action.type, productLog:'Product Add Success', productError: null };
        case 'PRODUCT_SET_ERROR': 
            return { productMessage: action.type, productLog:'Product Add Error', productError: action.err };
        case 'PRODUCT_UPDATE_RESET' :
            return {...initState, searchMessage:action.type};
        default: return state;
    }
}