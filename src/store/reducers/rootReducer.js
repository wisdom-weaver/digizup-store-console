import { combineReducers } from "redux"
import { firebaseReducer } from "react-redux-firebase"
import { firestoreReducer } from "redux-firestore"
import { authReducer } from "./authReducer"
import { searchReducer } from "./searchReducer"
import { productReducer } from "./productReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    search: searchReducer,
    productUpdates: productReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

export default rootReducer