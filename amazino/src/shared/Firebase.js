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