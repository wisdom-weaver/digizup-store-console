import { combineReducers } from "redux"
import { firebaseReducer } from "react-redux-firebase"
import { firestoreReducer } from "redux-firestore"
import { authReducer } from "./authReducer"
import { searchReducer } from "./searchReducer"
import { productReducer } from "./productReducer"
import { categoryReducer } from "./categoryReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    search: searchReducer,
    categoryReducer: categoryReducer,
    productUpdates: productReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

export default rootReducer