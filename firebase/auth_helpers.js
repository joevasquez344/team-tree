import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const registerUser = (email, password) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      console.log("Newly Registered User: ", user);

      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("Error: ", {
        errorCode,
        errorMessage,
      });
    });
};

const loginUser = (email, password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User now signed in: ", user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("Error: ", {
        errorCode,
        errorMessage,
      });
    });
};

export { registerUser, loginUser };
