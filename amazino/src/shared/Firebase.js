import * as firebase from 'firebase'

let database;
const firebaseConfig = {
  apiKey: "AIzaSyB7VteczvWn6nq2IZkgu8LFHNcURcmsq-0",
  authDomain: "amazino-3b363.firebaseapp.com",
  databaseURL: "https://amazino-3b363.firebaseio.com",
  projectId: "amazino-3b363",
  storageBucket: "",
  messagingSenderId: "628330225290",
  appId: "1:628330225290:web:47cbe90f36f59743"
};

export const fire = () => {
	if(!firebase.apps.length)
		firebase.initializeApp(firebaseConfig);

	database = firebase.database();
}