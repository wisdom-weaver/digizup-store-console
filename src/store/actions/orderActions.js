export const updateOrderAction  = (update)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        return firestore.collection('ordersForAdmins').doc(update.docid).update(update.data);
    }
}