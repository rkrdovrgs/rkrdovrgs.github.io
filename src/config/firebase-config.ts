import * as firebase from "firebase";

export class FirebaseConfiguration {

  configure() {
    // Initialize Firebase
    let config = {
      apiKey: "AIzaSyBxfsteMzu6X6G0BRT18zch8bwTTx3NHpc",
      authDomain: "quiz-generator-516ab.firebaseapp.com",
      databaseURL: "https://quiz-generator-516ab.firebaseio.com",
      projectId: "quiz-generator-516ab",
      storageBucket: "quiz-generator-516ab.appspot.com",
      messagingSenderId: "467478647718"
    };

    firebase.initializeApp(config);
  }
}