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

export const uploadItem = (seller, name, price, category, duedate, description) => {
    var itemData = {
        seller: seller,
        name : name,
        price : price,
        bets : [],
        dueDate: duedate,
        postDate: new Date(),
        category: category,
        description: description,
        itemImg: ""
    };

    var newItemKey = database.ref().child('items').push().key;
    var updates = {};
    updates['/items/' + newItemKey] = itemData;

    return database.ref().update(updates);
};

export const getAllItems = () => {
    return database.ref('items/').once('value');
};

export const getItemFromID = (itemID) => {
    return database.ref('items/' + itemID).once('value');
};

export const getItemFromKVPair = (key, value) => {
    var itemRef = database.ref('items/');
    var itemQuery = itemRef.orderByChild(key).equalTo(value);
    return itemQuery.once('value');
};

export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      console.log(firebase.auth().currentUser)
      return resolve();
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
}

export const signUp = (email, password, displayName) => {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(()=> {
      console.log('then');
      var user = firebase.auth().currentUser;
      var uid = user.uid
      database.ref("/").child("users/"+uid).set({
        displayName: 'displayName',
        email: email,
      })
      return resolve();
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
  
}

export const signOut = () => {
  firebase.auth.signOut().then(function() {
    console.log("signed out");
  }).catch(function(err) {
    console.log(err);
  })
}
