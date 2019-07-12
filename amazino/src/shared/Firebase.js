import * as firebase from 'firebase';


let database;
let storage;
const firebaseConfig = {
  apiKey: "AIzaSyB7VteczvWn6nq2IZkgu8LFHNcURcmsq-0",
  authDomain: "amazino-3b363.firebaseapp.com",
  databaseURL: "https://amazino-3b363.firebaseio.com",
  projectId: "amazino-3b363",
  storageBucket: "amazino-3b363.appspot.com",
  messagingSenderId: "628330225290",
  appId: "1:628330225290:web:47cbe90f36f59743"
};

export const fire = () => {
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  storage = firebase.storage();
};

const updateUserItems = (uid, item) => {
  return new Promise((resolve, reject) => {
    var newItemKey = database.ref('users/'+uid+'/itemIDs').push().key;
    var updates = {};
    updates['users/'+uid+'/itemIDs/'+newItemKey] = item;

    database.ref().update(updates).then(() => {
      return resolve();
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const updateUserBalance = (user, charge) => {
  return new Promise((resolve, reject) => {
    getUserBalance(user).then((balance) => {
      var newBalance = balance + charge;
      if(newBalance < 0) {
        reject({message: 'Not enough balance for payment'});
      }

      database.ref('users/'+user).update({balance: newBalance}).then(() => {
        return resolve(newBalance);
      }).catch((err) => {
        console.log(err);
        return reject(err);
      });
    }).catch((err) => {
      return reject(err);
    });
  });
};

const getPayment = (item, user) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('bets/'+item+'/'+user+'/payment').once('value').then(prevPay => {
      return resolve(prevPay.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

const cancelBet = (item, user, payment) => {
  return new Promise((resolve, reject) => {
    getPayment(item, user).then((prevPayment) => {
      if(prevPayment === payment) {
        firebase.database().ref('bets/'+item+'/'+user).remove().then(()=>{
          firebase.database().ref('users/'+user+'/betIDs/'+item).remove().then(()=>{
            database.ref('/items/'+item).update({status: "waitForBet"}).then(() => {}).catch((err) => {
              console.log(err);
              return reject(err);
            });
          }).catch((err) => {
                console.log(err);
                return reject(err);
              });
        }).catch((err) => {
          console.log(err);
          return reject(err);
        });
        return resolve();
      }

      var betData = {payment: prevPayment-payment};

      var updates = {};
      updates['/bets/'+item+'/'+user] = betData;
      firebase.database().ref().update(updates).then(() => {
        return resolve();
      }).catch((err) => {
        return reject(err);
      });
    }).catch((err) => {
      return reject(err);
    });
  })
};

export const getBetsOfItem = (itemId) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('bets/'+itemId).once('value').then(bets => {
      return resolve(bets.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

//
// Returns percentage of listing already bought
//
export const getPercentPurchased = (itemId) => {
  return new Promise((resolve, reject) => {
    getBetsOfItem(itemId).then(bets => {
      var totalBetted = 0;
      if(bets) {
        for(var bet in bets) {
          if(bets.hasOwnProperty(bet)) {
            totalBetted += bets[bet].payment;
          }
        }
      }
      getItemFromID(itemId).then(item => {
        if(item) {
          var price = item.price;
          var percentPurchased = Math.round((totalBetted / price) * 100) / 100;

          resolve(percentPurchased);
        } else {
          reject({message: "Could not find item"});
        }

      })
    })
  })
}

const processBet = (item, price) => {
  return new Promise((resolve, reject) => {
    getBetsOfItem(item).then((bets) => {
      var totalPayment = 0;
      Object.values(bets).map((bet) => {
        totalPayment += bet['payment'];
      });

      if(totalPayment > price) {
        return reject({message: 'Payment over total price'});
      } else if(totalPayment === price) {
        database.ref('/items/'+item).update({status: "readyToRaffle"}).then(() => {}).catch((err) => {
          console.log(err);
          return reject(err);
        });
      } else {
        database.ref('/items/'+item).update({status: "waitForBet"}).then(() => {}).catch((err) => {
          console.log(err);
          return reject(err);
        });
      }

      return resolve();
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

//
// Expects itemID
//
export const createBet = (item, user, payment) => {
  return new Promise((resolve, reject) => {
    getPayment(item, user).then((prevPayment) => {
      getItemPrice(item).then((price) => {
        if(payment+prevPayment > price/2) {
          reject({message: "Your bets cannot total over 50%"});
        } else if(payment+prevPayment === 0) {
          reject({message: "Payment less than 0"});
        } else if(payment+prevPayment < 0) {
          firebase.database().ref('bets/'+item+'/'+user).remove().then(()=>{
            firebase.database().ref('users/'+user+'/betIDs/'+item).remove().then(()=>{
              database.ref('/items/'+item).update({status: "waitForBet"}).then(() => {}).catch((err) => {
                console.log(err);
                return reject(err);
              });
            }).catch((err) => {
              console.log(err);
              return reject(err);
            });
          }).catch((err) => {
            console.log(err);
            return reject(err);
          });
          //return resolve();
        }

        var betData = {payment: payment+prevPayment};
        var updates = {};
        updates['/users/'+user+'/betIDs/'+item] = item;
        updates['/bets/'+item+'/'+user] = betData;

        database.ref().update(updates).then(() => {
          updateUserBalance(user, -payment).then(() => {
            processBet(item, price).then(() => {
              return resolve(betData);
            }).catch((err) => {
              cancelBet(item, user, payment).then(() => {
                updateUserBalance(user, payment).then(() => {
                  console.log("Bet Canceled and Payment Refunded");
                  return reject(err);
                }).catch((err) => {
                  console.log(err);
                  return reject(err);
                })
              }).catch((err) => {
                console.log(err);
                return reject(err);
              });
            })
          }).catch((err) => {
            console.log(err);
            cancelBet(item, user, payment).then(() => {}).catch((err) => {
              console.log(err);
              return reject(err);
            });
            return reject(err);
          });
        }).catch((err) => {
          console.log(err);
          return reject(err);
        });
      }).catch((err) => {
        console.log(err);
        return reject(err);
      });
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getImageByID = (itemId) => {
  return new Promise((resolve, reject) => {
    try {
      firebase.storage().ref().child('images/'+itemId).getDownloadURL().then(url => {
        if(url) {
          resolve(url);
        }
      })
    } catch(err) {
      console.log(err);
      reject(err);
    }
  })
};

export const uploadItem = async (uid, name, price, category, duedate, description, images) => {
  return new Promise((resolve, reject) => {
    var itemData = {
      seller: uid,
      name : name,
      price : price,
      bets : [],
      dueDate: duedate,
      postDate: new Date(),
      category: category,
      description: description,
      itemImg: "",
    };

    var newItemKey = database.ref().child('items').push().key;
    storage.ref().child('images/'+newItemKey).put(images).catch((err) => {
      console.log(err);
      return reject(err);
    })
    var updates = {};
    updates['/items/'+newItemKey] = itemData;

    database.ref().update(updates).then(() => {
      updateUserItems(uid, newItemKey).then(() => {
        return resolve();
      }).catch((err) => {
        console.log(err);
        return reject(err);
      });
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getAllItems = (limit) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('items').orderByChild('postDate').limitToLast(limit)
        .once('value').then(items => {
      return resolve(items.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getItemFromID = (itemID) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('items').child(itemID).once('value').then(items => {
      return resolve(items.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getItemPrice = (item) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('items/'+item+'/price').once('value').then(user => {
      return resolve(user.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getUserBalance = (uid) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('users/'+uid+'/balance').once('value').then(user => {
      return resolve(user.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getUserDataFromID = (uid) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('users').child(uid).once('value').then(user => {
      return resolve(user.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};


export const getItemFromKVPair = (key, value) => {
  var itemRef = database.ref('items/');
  var itemQuery = itemRef.orderByChild(key).equalTo(value);

  return new Promise((resolve, reject) => {
    itemQuery.once('value').then(item => {
      return resolve(item.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};

export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      return resolve(firebase.auth().currentUser);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};

export const signUp = (email, password, displayName) => {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(()=> {
      console.log('then');
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      database.ref("/").child("users/"+uid).set({
        displayName,
        email: email,
        balance: 10
      });
      return resolve(user);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};

export const signOut = () => {
  firebase.auth.signOut().then(function() {
    console.log("signed out");
  }).catch(function(err) {
    console.log(err);
  })
};

export const isSignIn = () => {
  if (firebase.auth().currentUser) return true;
  else return false;
};

export const getBalance = async (uid) => {
  return new Promise((resolve, reject) => {
    database.ref('users/'+uid).once('value', (snap) => {
      if(snap) {
        return resolve(snap.val().balance);
      } else {
        return reject({message: 'User not found'});
      }
    })
  })
};

export const updateBalance = (bal) => {
  database.ref('users/332kxRhgNodHzIzdMNhhsScGIpG2').update({
    balance: bal
  })
};

