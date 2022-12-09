import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBiBZpMTtBXB848w3mCdJbmibJqzk4Dumk",
	authDomain: "lab6final.firebaseapp.com",
	projectId: "lab6final",
	storageBucket: "lab6final.appspot.com",
	messagingSenderId: "334132750179",
	appId: "1:334132750179:web:3c290b8777f2aa21bc1556",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage };
export default db;
