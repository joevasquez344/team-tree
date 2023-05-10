// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import firebase from 'firebase/app'
import { getAuth } from "firebase/auth";
import {getStorage} from 'firebase/storage'
import { getFirestore, enableNetwork } from "firebase/firestore";



// const firebaseConfig = {
//   apiKey: "AIzaSyAnXgNgNzNDUk8zXInmbjtfgVs-idbT-uY",
//   authDomain: "dev-app-1b223.firebaseapp.com",
//   projectId: "dev-app-1b223",
//   storageBucket: "dev-app-1b223.appspot.com",
//   messagingSenderId: "231406092335",
//   appId: "1:231406092335:web:bd4995078ac062d41a46da",
// };

// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
// const db = getFirestore(app)
// const storage = getStorage(app);


// export { auth, app, db, storage };


const firebaseConfig = {
  apiKey: "AIzaSyBIhL34fIsZxf12GbSyGAYM6AnR0aXWo3c",
  authDomain: "team-tree-bc519.firebaseapp.com",
  projectId: "team-tree-bc519",
  storageBucket: "team-tree-bc519.appspot.com",
  messagingSenderId: "820053581082",
  appId: "1:820053581082:web:7e057f06532eec3c87e0a3",
  measurementId: "G-TZ79MJPXLH",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const db = getFirestore(app)
const storage = getStorage(app);

enableNetwork(db);


export { auth, app, db, storage };

