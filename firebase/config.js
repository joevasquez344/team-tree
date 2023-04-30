// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import firebase from 'firebase/app'
import { getAuth } from "firebase/auth";
import {getStorage} from 'firebase/storage'
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAnXgNgNzNDUk8zXInmbjtfgVs-idbT-uY",
  authDomain: "dev-app-1b223.firebaseapp.com",
  projectId: "dev-app-1b223",
  storageBucket: "dev-app-1b223.appspot.com",
  messagingSenderId: "231406092335",
  appId: "1:231406092335:web:bd4995078ac062d41a46da",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);


export { auth, app, db, storage };
