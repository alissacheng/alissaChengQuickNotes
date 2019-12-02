import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCjdQkJDOhBKPGulvr1a9rViGzoYcMjySA",
    authDomain: "project-five-1c3a4.firebaseapp.com",
    databaseURL: "https://project-five-1c3a4.firebaseio.com",
    projectId: "project-five-1c3a4",
    storageBucket: "project-five-1c3a4.appspot.com",
    messagingSenderId: "758428410845",
    appId: "1:758428410845:web:05dceab7554153b3114c34"
    };
  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
const storage = firebase.storage();

export{
  storage, firebase as default
}