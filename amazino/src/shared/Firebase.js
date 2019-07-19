import * as firebase from 'firebase';

// var CronJob = require('cron').CronJob;
// new CronJob('0 0 0 * * *', () => {
//   console.log("Started to expire items on dueDate");
//   expireItems(new Date());
// }, null, true, 'America/Los_Angeles');

export const expireItems = (date) => {
  getAllUnSoldItems().then((items) => {
    for(var i=0; i<items.length; i++) {
      var item = items[i];
      var expireDate = new Date(item['dueDate']);

      if(date.getDate() === expireDate.getDate()
          && date.getMonth() === expireDate.getMonth()
          && date.getFullYear() === expireDate.getFullYear()) {
        removeItem(item['itemID']).then(() => {
          console.log("Removed"+item['itemID']);
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }).catch((err) => {
    console.log(err);
  });
};

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

    return database.ref().update(updates).then(() => {
      return resolve();
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const updateUserBalance = (user, charge) => {
  return new Promise((resolve, reject) => {
    return getUserBalance(user).then((balance) => {
      var newBalance = balance + charge;
      if(newBalance < 0) return reject({message: 'Not enough balance for payment'});

      return database.ref('users/'+user).update({balance: newBalance}).then(() => {
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
    return firebase.database().ref('bets/'+item+'/'+user+'/payment').once('value').then(prevPay => {
      return resolve(prevPay.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

const cancelBet = (item, user, payment) => {
  return new Promise((resolve, reject) => {
    return getPayment(item, user).then((prevPayment) => {
      if(prevPayment === payment) {
        return firebase.database().ref('bets/'+item+'/'+user).remove().then(()=>{
          return firebase.database().ref('users/'+user+'/betIDs/'+item).remove().then(()=>{
            return database.ref('/items/'+item).update({status: "waitForBet"}).then(() => {}).catch((err) => {
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
      }

      var betData = {payment: prevPayment-payment};

      var updates = {};
      updates['/bets/'+item+'/'+user] = betData;
      return firebase.database().ref().update(updates).then(() => {
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
    return firebase.database().ref('bets/'+itemId).once('value').then(bets => {
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
    return getBetsOfItem(itemId).then(bets => {
      var totalBetted = 0;
      if(bets) {
        for(var bet in bets) {
          if(bets.hasOwnProperty(bet)) totalBetted += bets[bet].payment;
        }
      }
      return getItemFromID(itemId).then(item => {
        if(item) {
          var price = item.price;
          var percentPurchased = Math.round((totalBetted / price) * 100) / 100;

          return resolve(percentPurchased);
        } else {
          return reject({message: "Could not find item"});
        }
      });
    });
  });
};

const processBet = (item, price) => {
  return new Promise((resolve, reject) => {
    return getBetsOfItem(item).then((bets) => {
      var totalPayment = 0;
      Object.values(bets).map((bet) => {
        totalPayment += bet['payment'];
        return null;
      });

      if(totalPayment > price) {
        return reject({message: 'Payment over total price'});
      } else if(totalPayment === price) {
        return database.ref('/items/'+item).update({status: "readyToRaffle"}).then(() => {
          return resolve();
        }).catch((err) => {
          console.log(err);
          return reject(err);
        });
      } else {
        return database.ref('/items/'+item).update({status: "waitForBet"}).then(() => {
          return resolve();
        }).catch((err) => {
          console.log(err);
          return reject(err);
        });
      }
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
    return getPayment(item, user).then((prevPayment) => {
      return getItemPrice(item).then((price) => {
        if(payment+prevPayment > price/2) {
          return reject({message: "Your bets cannot total over 50%"});
        } else if(payment+prevPayment < 0) {
          return reject({message: "Payment less than 0"});
        } else if(payment+prevPayment === 0) {
          console.log("refund all payment");
          return updateUserBalance(user, -payment).then(() => {
            console.log("Bet Canceled and Payment Refunded");
            return firebase.database().ref('bets/'+item+'/'+user).remove().then(()=>{
              return firebase.database().ref('users/'+user+'/betIDs/'+item).remove().then(()=>{
                return database.ref('/items/'+item).update({status: "waitForBet"}).then(() => {
                  return resolve();
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
          }).catch((err) => {
            console.log(err);
            return reject(err);
          });
        }

        var betData = {payment: payment+prevPayment};
        var updates = {};
        updates['/users/'+user+'/betIDs/'+item] = item;
        updates['/bets/'+item+'/'+user] = betData;

        return database.ref().update(updates).then(() => {
          return updateUserBalance(user, -payment).then(() => {
            return processBet(item, price).then(() => {
              return resolve(betData);
            }).catch((err) => {
              return cancelBet(item, user, payment).then(() => {
                return updateUserBalance(user, payment).then(() => {
                  console.log("Bet Canceled and Payment Refunded");
                  return reject(err);
                }).catch((err) => {
                  console.log(err);
                  return reject(err);
                });
              }).catch((err) => {
                console.log(err);
                return reject(err);
              });
            })
          }).catch((err) => {
            console.log(err);
            return cancelBet(item, user, payment).then(() => {
              return reject(err);
            }).catch((err) => {
              console.log(err);
              return reject(err);
            });
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

const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const blockBets = (itemId, winnerId) => {
  return new Promise((resolve, reject) => {
    return database.ref('/items/'+itemId).update({status: "SoldOut", winner: winnerId}).then(() => {
      return getBetsOfItem(itemId).then(async (bets) => {
        var removeFromUsers = Object.keys(bets).map(async (userId) => {
          await firebase.database().ref('users/'+userId+'/betIDs/'+itemId).remove().then(() => {
            return resolve();
          }).catch((err) => {
            return reject(err);
          });
          return null;
        });

        return await Promise.all(removeFromUsers).then(() => {
          return firebase.database().ref('bets/'+itemId).remove().then(() => {
            console.log("bet deleted");
            return resolve();
          }).catch((err) => {
            return reject(err);
          });
        }).catch((err) => {
          return reject(err);
        });
      }).catch((err) => {
        return reject(err);
      })
    }).catch((err) => {
      return reject(err);
    });
  });
};

export const doRaffle = (itemID) => {
  return new Promise((resolve, reject) => {
    return getItemFromID(itemID).then((item) => {
      if(item.status !== "readyToRaffle") throw new Error("Item not ready to start raffle");

      return getBetsOfItem(itemID).then((bets) => {
        var chunkList = [];
        Object.keys(bets).map((userID) => {
          var bet = bets[userID];
          for(var i=0; i<20*bet['payment']/item['price']; i++) {
            chunkList.push(userID);
          }
          return null;
        });
        shuffle(chunkList);

        var winnerId = chunkList[0];
        return blockBets(itemID, winnerId).then(() => {
          return getItemFromID(itemID).then(item => {
            return updateUserBalance(item['seller'], item['price']).then(() => {
              return resolve(winnerId);
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            return reject(err);
          });
        }).catch((err) => {
          console.log(err);
          return reject(err);
        });
      }).catch((err) => {
        return reject(err);
      })
    }).catch((err) => {
      return reject(err);
    });
  });
};

export const getImageByID = (itemId) => {
  return new Promise((resolve, reject) => {
    return firebase.storage().ref().child('images/'+itemId).getDownloadURL().then(url => {
      if(url) return resolve(url);
    }).catch( err => {
      return reject(err);
    })
  })
};

export const removeItem = (itemId) => {
  return new Promise((resolve, reject) => {
    return getBetsOfItem(itemId).then(async (bets) => {
      if(bets) {
        var betRemoved = Object.keys(bets).map(async (userId) => {
          var bet = bets[userId];
          await createBet(itemId, userId, -bet['payment']).then(() => {}).catch((err) => {
            return reject(err);
          });
          return null;
        });

        return await Promise.all(betRemoved).then(() => {
          return firebase.database().ref('items/'+itemId).remove().then(() => {
            console.log("item deleted");
            firebase.database().ref('bets/'+itemId).remove().then(() => {
              console.log("bet deleted");
              return resolve();
            }).catch((err) => {
              return reject(err);
            });
          }).catch((err) => {
            return reject(err);
          });
        }).catch((err) => {
          return reject(err);
        });
      } else {
        return firebase.database().ref('items/'+itemId).remove().then(() => {
          console.log("item deleted");
          return resolve();
        }).catch((err) => {
          console.log(err);
          return reject(err);
        });
      }
    }).catch((err) => {
      return reject(err);
    });
  });
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
      status: "waitForBet",
    };
    console.log(duedate);

    var newItemKey = database.ref().child('items').push().key;
    storage.ref().child('images/'+newItemKey).put(images).catch((err) => {
      console.log(err);
      return reject(err);
    });
    var updates = {};
    updates['/items/'+newItemKey] = itemData;

    return database.ref().update(updates).then(() => {
      return updateUserItems(uid, newItemKey).then(() => {
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

export const getAllItems = (limit, pageNum, search, filter) => {
  return new Promise((resolve, reject) => {
    var returnItems = [];
    var filteredItems = [];
    var filterAll = true;
    return firebase.database().ref('items').once('value').then((itemVal) => {
      var items = itemVal.val();
      if(!items) return resolve(returnItems);

      Object.keys(items).map(key => {
        var item = items[key];
        if(item['status'] !== "SoldOut") {
          item['itemID'] = key;
          returnItems.push(item);
        }
        return null;
      });

      returnItems.sort((a, b) => new Date(b['postDate']) - new Date(a['postDate']));
      Object.keys(filter).map(key => {
        if (filter[key]) filterAll = false;
      })
      Object.keys(returnItems).map(key => {
        var ritem = returnItems[key]
        var filterOne = filter[ritem.category] || filterAll;
        if (search && ritem.name.toLowerCase().search(search.toLowerCase()) !== -1
            && filterOne)
          return filteredItems.push(ritem);
        else if(!search && filterOne)
          return filteredItems.push(ritem);
        else
          return null;
      })
      return resolve(filteredItems.slice((pageNum-1)*limit, pageNum*limit));
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getAllUnSoldItems = () => {
  return new Promise((resolve, reject) => {
    var returnItems = [];
    return firebase.database().ref('items').once('value').then((itemVal) => {
      var items = itemVal.val();
      if(!items) return resolve(returnItems);

      Object.keys(items).map(key => {
        var item = items[key];
        if(item['status'] !== "SoldOut") {
          item['itemID'] = key;
          returnItems.push(item);
        }
        return null;
      });

      return resolve(returnItems);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getItemFromID = (itemID) => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref('items').child(itemID).once('value').then(items => {
      return resolve(items.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getItemPrice = (item) => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref('items/'+item+'/price').once('value').then(user => {
      return resolve(user.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getUserBalance = (uid) => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref('users/'+uid+'/balance').once('value').then(user => {
      return resolve(user.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getUserDataFromID = (uid) => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref('users').child(uid).once('value').then(user => {
      return resolve(user.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};

export const getItemsByWinner = (winnerId, limit, pageNum) => {
  return new Promise((resolve, reject) => {
    var returnItems = [];
    return getItemFromKVPair("winner", winnerId).then((items) => {
      if(!items) return resolve(returnItems);

      Object.keys(items).map(key => {
        var item = items[key];
        item['itemID'] = key;
        returnItems.push(item);
        return null;
      });

      returnItems.sort((a, b) => new Date(b['postDate']) - new Date(a['postDate']));
      return resolve(returnItems.slice((pageNum-1)*limit, pageNum*limit));
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  });
};

export const getItemsBySeller = (sellerId, limit, pageNum) => {
  return new Promise((resolve, reject) => {
    var returnItems = [];
    return getItemFromKVPair("seller", sellerId).then((items) => {
      if(!items) return resolve(returnItems);

      Object.keys(items).map(key => {
        var item = items[key];
        item['itemID'] = key;
        returnItems.push(item);
        return null;
      });

      returnItems.sort((a, b) => new Date(b['postDate']) - new Date(a['postDate']));
      return resolve(returnItems.slice((pageNum-1)*limit, pageNum*limit));
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  });
};

export const getItemsByStatus = (status, limit, pageNum) => {
  return new Promise((resolve, reject) => {
    var returnItems = [];
    return getItemFromKVPair("status", status).then((items) => {
      if(!items) return resolve(returnItems);

      Object.keys(items).map(key => {
        var item = items[key];
        item['itemID'] = key;
        returnItems.push(item);
        return null;
      });

      returnItems.sort((a, b) => new Date(b['postDate']) - new Date(a['postDate']));
      return resolve(returnItems.slice((pageNum-1)*limit, pageNum*limit));
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getItemFromKVPair = (key, value) => {
  var itemRef = database.ref('items/');
  var itemQuery = itemRef.orderByChild(key).equalTo(value);

  return new Promise((resolve, reject) => {
    return itemQuery.once('value').then(item => {
      return resolve(item.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};

export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      return resolve(firebase.auth().currentUser);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};

export const signUp = (email, password, displayName) => {
  return new Promise((resolve, reject) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(()=> {
      console.log('then');
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      database.ref("users/"+uid).update({
        displayName,
        email: email,
        balance: 10
      })
        
      return resolve(user);
     
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  })
};

export const signOut = () => {
  return firebase.auth.signOut().then(function() {
    console.log("signed out");
  }).catch(function(err) {
    console.log(err);
  })
};

export const isSignIn = () => {
  return !!firebase.auth().currentUser;
};

const getSoldItemsByWinner = (userID) => {
  return new Promise((resolve, reject) => {
    var returnItems = [];
    return firebase.database().ref('items').once('value').then((itemVal) => {
      var items = itemVal.val();
      if(!items) return resolve(returnItems);

      Object.keys(items).map(key => {
        var item = items[key];
        if(item['status'] === "SoldOut" && item['winner'] === userID) {
          item['itemID'] = key;
          returnItems.push(item);
        }
        return null;
      });

      return resolve(returnItems);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const getBetItemsByUser = (userID) => {
  return new Promise((resolve, reject) => {
    return getUserDataFromID(userID).then(async (user) => {
      var items = [];
      var itemIDs = Object.keys(user['betIDs']);
      for(var i=0; i<itemIDs.length; i++) {
        await firebase.database().ref('items/'+itemIDs[i]).once('value').then((itemVal) => {
          var item = itemVal.val();
          item['itemID'] = itemIDs[i];
          items.push(item);
        }).catch((err) => {
          return reject(err);
        });
      }

      return getSoldItemsByWinner(userID).then((soldItems) => {
        return resolve(items.concat(soldItems));
      }).catch((err) => {
        console.log(err);
        return reject(err);
      })
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

export const numOfItems = () => {
  return new Promise((resolve, reject) => {
    var returnItems = [];
    return firebase.database().ref('items').once('value').then((itemVal) => {
      var items = itemVal.val();
      if(!items) return resolve(returnItems);

      Object.keys(items).map(key => {
        var item = items[key];
        if(item['status'] !== "SoldOut") {
          item['itemID'] = key;
          returnItems.push(item);
        }
        return null;
      });

      return resolve(returnItems.length);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    })
  });
};

export const getBalance = async (uid) => {
  return new Promise((resolve, reject) => {
    return database.ref('users/'+uid).once('value', (snap) => {
      if(snap) {
        return resolve(snap.val().balance);
      } else {
        return reject({message: 'User not found'});
      }
    })
  })
};

export const updateBalance = (bal) => {
  return database.ref('users/332kxRhgNodHzIzdMNhhsScGIpG2').update({
    balance: bal
  })
};

