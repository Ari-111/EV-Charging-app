// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration  
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVIpT3YT1Pios4hhuxhrTyG1N2F007e6c",
  authDomain: "ev-charging-c4ea6.firebaseapp.com",
  projectId: "ev-charging-c4ea6",
  storageBucket: "ev-charging-c4ea6.firebasestorage.app",
  messagingSenderId: "614588973580",
  appId: "1:614588973580:web:14566c3e3c78acc46fe429",
  measurementId: "G-FH8SLRFNZ7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics only if supported in the current environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((error) => {
    console.log('Analytics not supported:', error);
  });
}

export { analytics };
