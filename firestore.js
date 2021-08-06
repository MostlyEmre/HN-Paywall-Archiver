// import Firebase firestore
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
// Initialize firestore
firebase.initializeApp({
  apiKey: "AIzaSyD_A_G16z-XJquZkC-axpKLC3qotwFTRRA",
  authDomain: "hn-archive-309a1.firebaseapp.com",
  projectId: "hn-archive-309a1",
});

let db = firebase.firestore();

module.exports = {
  db,
};
