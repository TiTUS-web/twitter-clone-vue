import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfmMBydj9f5qwLzWiL6YTCFiXs2OXpyOc",
  authDomain: "twitter-clone-d6966.firebaseapp.com",
  databaseURL: "https://twitter-clone-d6966-default-rtdb.firebaseio.com",
  projectId: "twitter-clone-d6966",
  storageBucket: "twitter-clone-d6966.appspot.com",
  messagingSenderId: "1010509510322",
  appId: "1:1010509510322:web:f6f7b4c1e4f5e5b0aafbab",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
