import firebase from "firebase/app";
import 'firebase/auth';      //firebase authentication
import 'firebase/firestore'; //firebase firestore
import 'firebase/analytics'; //firebase analytics

export const firebaseConfig ={
  apiKey: "AIzaSyBHW5GkbAYKKiS-0O7V9yE6I_rhqdm5dmI",
  authDomain: "digizup-store-test1.firebaseapp.com",
  databaseURL: "https://digizup-store-test1.firebaseio.com",
  projectId: "digizup-store-test1",
  storageBucket: "digizup-store-test1.appspot.com",
  messagingSenderId: "629806898681",
  appId: "1:629806898681:web:ddcb815a9177a59d6b7128",
  measurementId: "G-B7TL94P73H"
}


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export default firebase;