const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//
// Delete overdue items in database daily, along with data tied to user 
//
exports.dailyCleanup = functions.pubsub.schedule('59 23 * * *').onRun(async (context) => {
    var items = await admin.database().ref('items/').once('value').catch(err => {
        return err;
    });
    items = items.val();

    // Loop through all items to check for items past duedate
    for (var item in items) {
        if (items.hasOwnProperty(item)) {
            console.log(item);
            var currentDate = new Date();
            currentDate = currentDate.getTime();
            var dueDate = new Date(items[item].dueDate);
            dueDate = dueDate.getTime();
            var uid = items[item].seller;

            // Delete items past due date, except items that have been sold
            if(currentDate > dueDate && items[item].status !== "SoldOut") {
                console.log("found item");
                admin.database().ref('bets/'+item).once('value').then((bets) => {
                    // Refund all bets
                    if(bets) {
                        bets = bets.val();

                        //
                        // Loop through bets, bet is UID string
                        //
                        Object.keys(bets).map(bet => {
                            admin.database().ref('users/'+ bet).once('value').then((user) => {
                                // get user to refund payment
                                if(user) {
                                    user = user.val();
                                    var balance = user.balance;
                                    // add balance back to user's balance
                                    balance += bets[bet].payment;
                                    admin.database().ref('users/'+bet).update({balance})
                                    .then(() => {
                                        // Remove bet from buyer's record
                                        return admin.database().ref('users/'+bet+"/betIDs/"+item).remove();
                                    })
                                    .catch(err => {
                                        return err;
                                    });
                                    console.log(user);
                                }
                                return user;
                            }).catch(err => {
                                return err;
                            })
                        }).catch(err => {
                            return err;
                        })
                    }
                    return bets;
                })
                .then(() => {
                    // Remove listing from seller's account
                    return admin.database().ref('users/'+uid+"/itemIDs/"+item).remove();
                })
                .then(() => {
                    // Remove account after bets have been removed and refunded
                    return admin.database().ref('items/'+item).remove();
                })
                .catch(err => {
                    return err;
                });
                
            }
        }
    }
    return console.log("Deleted items past dueDate");
})
