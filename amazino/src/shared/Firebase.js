import * as firebase from 'firebase';

/* Code for expiring items on time (Now diabled, use cronjob.js in shared folder */
// var CronJob = require('cron').CronJob;
// new CronJob('0 0 0 * * *', () => {
//   console.log("Started to expire items on dueDate");
//   expireItems(new Date());
// }, null, true, 'America/Los_Angeles');

/* Expire item in the database on 'date' */
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

/**
 * Initialize firebase
 */
export const fire = () => {
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  storage = firebase.storage();
};

/* Functions for user notification */
export const updateUserNotiBet = (uid) => {
  console.log(uid);
  return new Promise((resolve, reject) => {
    return database.ref('users/'+uid).update({notiBet: 0}).then(() => {
      return resolve(0);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};


export const updateUserNotiItem = (uid) => {
  return new Promise((resolve, reject) => {
    return database.ref('users/'+uid).update({notiItem: 0}).then(() => {
      return resolve(0);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

/**
 * Associate item with user's account
 * @param {string} uid - User's user id
 * @param {string} item - The item's id
 */
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

/**
 * Subtract charge from user's balance
 * @param {string} user - User's user id
 * @param {double} charge - Charge in dollars
 */
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

/**
 * Get payment of user in bets on given item
 * @param {string} item - The item's id
 * @param {string} user - User's user id
 */
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

/**
 * Cancel bet of given price for user
 * @param {string} item - The item's id
 * @param {string} user - User's user id
 * @param {double} payment - Price in dollars to refund
 */
const cancelBet = (item, user, payment) => {
  return new Promise((resolve, reject) => {
    return getPayment(item, user).then((prevPayment) => {
      if(prevPayment === payment) {
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

/**
 * Get all bets for given item
 * @param {string} itemId - The item's id
 */
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

/**
 * Returns percentage of listing already bought
 * @param {string} itemId - The item's id
 */
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

/**
 * Updates item given new bet payment
 * @param {string} item - The item's ID
 * @param {double} price - The payment of the new bet
 */
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
          // Notify seller when item ready to raffle
          return database.ref('/items/'+item).once('value').then((fullItem) => {
            fullItem = fullItem.val();
            addNotification(fullItem.seller, "An item you're selling is ready to raffle!", 
            "Your item, " + fullItem.name + ", is now ready to raffle. Click this notifcation to view.", 
            "/listing/" + item).then(() => {
              return resolve();
            }).catch(err => {
              return reject(err);
            })
          })
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

/**
 * Creates bet of given payment size for user
 * @param {string} item - The item's ID to bet on
 * @param {string} user - User's user id
 * @param {double} payment - Payment associated with bet in dollars
 */
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

/**
 * Randomly shuffle given array
 * @param {array} - Array to shuffle
 */
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

/**
 * Execute raffle and choose winner for given item, expect "SoldOut" status
 * @param {string} itemID - The item's id
 */
export const doRaffle = (itemID) => {
  return new Promise((resolve, reject) => {
    return getItemFromID(itemID).then((item) => {
      if(item.status !== "readyToRaffle") return reject({message: "Item not ready to start raffle"});

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
        return database.ref('/items/'+itemID).update({status: "SoldOut", winner: winnerId}).then(() => {
        // return blockBets(itemID, winnerId).then(() => {
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

/**
 * Get image by given ID
 * @param {string} itemId - The item's id
 */
export const getImageByID = (itemId) => {
  return new Promise((resolve, reject) => {
    return firebase.storage().ref().child('images/'+itemId).getDownloadURL().then(url => {
      if(url) return resolve(url);
    }).catch( err => {
      return reject(err);
    })
  })
};

/**
 * Remove item with given item id
 * @param {string} itemId - The item's id
 */
export const removeItem = (itemId) => {
  return new Promise((resolve, reject) => {
    return getItemFromID(itemId).then((item) => {
      if(item["status"] === "SoldOut") return reject({message: 'Item is SoldOut'});

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
    }).catch((err) => {
      return reject(err);
    });
  });
};

/**
 * Upload item with given information
 * @param {string} uid - Seller's user id
 * @param {string} name - Name/title of the item
 * @param {double} price - Price of the item
 * @param {string} category - Item's category
 * @param {Date} duedate - Item's duedate
 * @param {string} description - Description of the item
 * @param {Image} images - images to add to storage for item
 */
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
      winner: "",
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

/**
 * Gets all market items, with page limit and page number
 * @param {int} limit - Limit number of items per page
 * @param {int} pageNum - Page from which to return items
 * @param {string} search - Search string to factor in
 * @param {Object} filter - Object containing boolean values of all category filters
 */
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
      });
      Object.keys(returnItems).map(key => {
        var ritem = returnItems[key];
        var filterOne = filter[ritem.category] || filterAll;
        if (search && ritem.name.toLowerCase().search(search.toLowerCase()) !== -1
            && filterOne)
          return filteredItems.push(ritem);
        else if(!search && filterOne)
          return filteredItems.push(ritem);
        else
          return null;
      });
      return resolve(filteredItems.slice((pageNum-1)*limit, pageNum*limit));
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

/**
 * Returns all items without "SoldOut" status
 */
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

/**
 * Gets item object from its id
 * @param {string} itemID - The item's ID
 */
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

/**
 * Get price of given item
 * @param {string} item - The item's ID
 */
export const getItemPrice = (itemID) => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref('items/'+itemID+'/price').once('value').then(user => {
      return resolve(user.val());
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

/**
 * Get user's balance
 * @param {string} uid - User's user id
 */
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

/**
 * Get user data associated with user id
 * @param {string} uid - User's user id
 */
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

/**
 * Get all items a user has won
 * @param {string} winnerId - User's user id
 * @param {int} limit - Limit number of items per page
 * @param {int} pageNum - Page from which to return items
 */
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

/**
 * Get all items a user has posted
 * @param {string} sellerId - User's user id
 * @param {int} limit - Limit number of items per page
 * @param {int} pageNum - Page from which to return items
 */
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

/**
 * Returns all items with given status
 * @param {string} status - Status of items the function should return
 * @param {int} limit - Limit number of items per page
 * @param {int} pageNum - Page from which to return items
 */
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

/**
 * Sign user in with email and password
 * @param {string} email - Email to sign in with
 * @param {string} password - Password to sign in with
 */
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

/**
 * Signs up new user with email and password
 * @param {string} email - Email address to associate with this account
 * @param {string} password - Password for this account
 * @param {string} displayName - New display name to associate with this account 
 */
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

/**
 * Signs out current user
 */
export const signOut = () => {
  return firebase.auth.signOut().then(function() {
    console.log("signed out");
  }).catch(function(err) {
    console.log(err);
  })
};

/**
 * Returns true if user is currently signed in
 */
export const isSignIn = () => {
  return !!firebase.auth().currentUser;
};

/**
 * Get all items won by given user
 * @param {string} userID - User's user id
 */
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

/**
 * Get all items a user has bet on
 * @param {string} userID - User's user id
 */
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

      return resolve(items);
      // return getSoldItemsByWinner(userID).then((soldItems) => {
      //   return resolve(items.concat(soldItems));
      // }).catch((err) => {
      //   console.log(err);
      //   return reject(err);
      // });
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};

/**
 * Get number of items visible in market
 */
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

/**
 * Get's balance for user
 * @param {string} uid - User's user id
 */
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


/**
 * Adds notification to user on database
 * @param {string} uid - User's user id
 * @param {string} title - Title of notification
 * @param {string} message - Notification's message
 * @param {string} path - Path this notification will redirect to when clicked
 */
export const addNotification = (uid, title, message, path) => {
  return new Promise((resolve, reject) => {
    var key = database.ref('users/'+uid+'/notifications/').push().key;
    var notif = {
      title,
      message,
      path,
      time: new Date(),
      read: false
    };

    return database.ref('users/'+uid+'/notifications/'+key).update(notif).then(() => {
      return resolve();
    }).catch(err => {
      return reject(err);
    })
  });
};

/**
 * Delete notification at given id
 * @param {string} uid - User's user id
 * @param {string} notifId - ID of the user's notification
 */
export const deleteNotification = (uid, notifId) => {
  return new Promise((resolve, reject) => {
    return database.ref('users/'+uid+'/notifications/'+notifId).remove().then(() => {
      return resolve();
    }).catch(err => {
      return reject(err);
    });
  });
};


/**
 * Get all notifications for user
 * @param {string} uid - User's user id
 */
export const getNotifications = (uid) => {
  return new Promise((resolve, reject) => {
    return database.ref('users/'+uid +'/notifications/').once('value').then(notifs => {
      return resolve(notifs.val());
    }).catch(err => {
      return reject(err);
    });
  });
};


/**
 * Read notification with given notification id for user at uid
 * @param {string} uid - User's user id
 * @param {string} notifId - ID of user's notification
 */
export const readNotification = (uid, notifId) => {
  return new Promise((resolve, reject) => {
    var notifReference = database.ref('users/'+uid+'/notifications/'+notifId);
    return notifReference.once('value').then((notif) => {
      if(notif.val()) {
        return notifReference.update({read: true}).then(() => {
          return resolve();
        })
      }
      return resolve();
    }).catch(err => {
      return reject(err);
    });
  });
}

/**
 * Get number of new notifications
 * @param {string} uid - User's user id
 */
export const getNumNewNotifications = (uid) => {
  return new Promise((resolve, reject) => {
    return database.ref('users/'+uid+'/notifications').once('value').then(notifs => {
      notifs = notifs.val();
      var numNewNotifs = 0;
      for(var notif in notifs) {
        if(!notifs[notif].read) {
          numNewNotifs++;
        }
      }
      return resolve(numNewNotifs);
    }).catch(err => {
      return reject(err)
    });
  });
}

/**
 * Update user's biography to new string, can be used to create new bio. For now, bio is only field
 * @param {string} uid - User's user id
 * @param {string} bio - Bio string to associate with user
 */
export const updateProfileInfo = (uid, bio) => {
  return new Promise((resolve, reject) => {
    return database.ref('users/'+uid).update({bio}).then(() => {
      return resolve();
    }).catch(err => {
      return reject(err);
    });
  });
} 