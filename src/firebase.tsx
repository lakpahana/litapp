// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAa3zeEFw7BYbBu6d8vhGX2T2hYoHtSoQ8",
    authDomain: "ballerina-firebase.firebaseapp.com",
    databaseURL: "https://ballerina-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ballerina-firebase",
    storageBucket: "ballerina-firebase.appspot.com",
    messagingSenderId: "476129313390",
    appId: "1:476129313390:web:3b39afceca7ead21819c7f",
    measurementId: "G-XY2ZB9Z8D5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//realtime database
//const db = getDatabase(app);
const db = getDatabase();
const analytics = getAnalytics(app);
const fstorage = getStorage(app);

export { db, analytics, fstorage};