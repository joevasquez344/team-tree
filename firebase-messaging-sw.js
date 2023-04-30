import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAnXgNgNzNDUk8zXInmbjtfgVs-idbT-uY",
  authDomain: "dev-app-1b223.firebaseapp.com",
  projectId: "dev-app-1b223",
  storageBucket: "dev-app-1b223.appspot.com",
  messagingSenderId: "231406092335",
  appId: "1:231406092335:web:bd4995078ac062d41a46da",
};

const app = initializeApp(firebaseConfig);

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging(app);
getToken(messaging, {
  vapidKey:
    "BFXr3Xu47hAHAXCjTura17VFxFVPChWDUZ8oylxU1K_SNh32QFZTsBSdNNXPvSNeIDTQyh_yLY0m-O9a6tvLBHo",
})
  .then((currentToken) => {
    if (currentToken) {
      console.log("Current Token: ", currentToken);
      // Send the token to your server and update the UI if necessary
      // ...
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log("Granted");
          }
        })
        .catch((err) => {
          console.log("Error Occured", err);
        });
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
}

requestPermission();
