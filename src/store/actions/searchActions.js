import _ from "lodash";

export const searchAction = (searchTerm, category)=>{
    // console.log('in searchAction', searchTerm, category);
    return async (dispatch, getState, {getFirestore, getFirebase})=>{
        // dispatch({type:'SEARCH_IN_PROGRESS'});
        const firestore = getFirestore();
        // searchTerm= searchTerm.toLowerCase();
        var keywords = searchTerm.split(/(?:,| |\+|-|\(|\))+/);
        keywords = keywords.concat( keywords.map(each=>each.toLowerCase()) );
        console.log('keywords=>', keywords);
        if(category == 'Products'){
            const snaps = await firestore.collection('products').where('tags','array-contains-any',keywords).get();
            if(snaps.empty) console.log('empty')
            snaps.forEach(doc=>{
                console.log(doc.id);
            })
        }else if(category == 'Users'){
            const snaps = await firestore.collection('users').where('tags','array-contains-any',keywords).get();
            if(snaps.empty) console.log('empty')
            snaps.forEach(doc=>{
                console.log(doc.id);
            })
        }else if(category == 'Orders'){
            // const snaps = await firestore.collection('users').where('')
        }
    }
}

export const searchResetAction = ()=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        return dispatch({ type:"SEARCH_RESET" });
    }
}