export const updateProductInstock  = (productid, hasOptions, option ,inStock)=>{
    console.log(productid, hasOptions, option ,inStock);
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        if(hasOptions){
            var updateOb = {};
            updateOb[`productOptions.${option}.inStock`] = inStock
            firestore.collection('products').doc(productid).update( updateOb );
        }else{
            firestore.collection('products').doc(productid).update({ inStock });
        }
    }
}

export const addProductAction  = (newProduct)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        dispatch({type:'PRODUCT_ADD_IN_PROGRESS'});
        const firestore = getFirestore();
        return firestore.collection('products').add({ ...newProduct, createdAt: new Date()})
        .then(()=>{dispatch({type:"PRODUCT_ADD_SUCCESS"})})
        .catch((err)=>{dispatch({type:"PRODUCT_ADD_ERROR", err: err.message})});

    }
}

export const productUpdateReset  = ()=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        return dispatch({type:"PRODUCT_UPDATE_RESET"})
    }
}