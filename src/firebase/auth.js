import {
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";
// signInWithCustomToken(auth, token)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ...
//   });

class FirebaseService {
  registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  getUsers = async () => {};
  loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
}

export const firebaseService = new FirebaseService();
