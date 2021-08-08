import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyD_A_G16z-XJquZkC-axpKLC3qotwFTRRA",
  authDomain: "hn-archive-309a1.firebaseapp.com",
  projectId: "hn-archive-309a1",
  storageBucket: "hn-archive-309a1.appspot.com",
  messagingSenderId: "417191557046",
  appId: "1:417191557046:web:43f9c2d7b45cd5b91c3317",
  measurementId: "G-NJTW7T0QT0",
});

let db = firebase.firestore();

export default db;
