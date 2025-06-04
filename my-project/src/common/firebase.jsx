import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC_NYzAVPQR0r9_o8FwH0GLMHFsf7hvd2o",
  authDomain: "blogo-7a988.firebaseapp.com",
  projectId: "blogo-7a988",
  storageBucket: "blogo-7a988.firebasestorage.app",
  messagingSenderId: "152864843830",
  appId: "1:152864843830:web:bda85299eaaac3874d9097",
  measurementId: "G-FVWBMNYM6H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const provider = new GoogleAuthProvider()