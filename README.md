# AMAZINO
Repository for UCSC SE Team Project </br>
By team Brokers </br>

Team member
 - Ryan Steinwert (rsteinwe@ucsc.edu)
 - Yuxi Ma (yma71@ucsc.edu)
 - Marcus Nikaido (mnikaido@ucsc.edu)
 - Jaeho Moon (jmoon15@ucsc.edu)
 - HyungJun Yoon (hyjyoon@ucsc.edu)

USE SCENARIO
1. Seller registers stuff with the anticipated price. </br>
ex) 'A' registers a bike with $30.
2. Customers who want to buy that stuff bet on it. </br>
ex) 'B' pays $5, 'C' pays $2, etc...
3. If the total payment of the customers on that stuff reaches the anticipates price, the 'drawing phase' is started.
Each person who participated in the betting has (personal payment * 100 / total price) % chance to get the stuff. </br>
ex) 'B' has 16.67%, 'C' has 6.67% chance to win the drawing phase.
4. The winner of the 'drawing phase' is decided! He/she gets the stuff, and the seller gets all of the payment. </br>
ex) Miraculously, 'C' was chosen with the 6.67% probability! 'C' gets the bike and 'A' gets the whole money.
</br></br>

INSTALLATION GUIDES</br>
For customers:</br>
Our application is webpage-based, so you can use our service by going to https://amazino-3b363.firebaseapp.com.</br>
For developers (who wants to host our site):</br>
If you want to host our site, you can clone our system codes in github (https://github.com/diamond264/AMAZINO). We use firebase for hosting & realtime database, so to use your own database, you should change firebaseConfig in amazino/src/shared/Firebase.js with your own configuration. And we defined our npm dependency in package.json, so you should type ‘npm install’ on your terminal. (in the home directory of AMAZINO)
</br></br>

USER MANUAL
As a user, you can use our site in the current hosted address, https://amazino-3b363.firebaseapp.com
There are fundamental signup & login/logout functions in our site. You can make your own account and enjoy our site!
In the profile page, you can see your own information such as your display name or balance. And you can charge your own balance by adding a numeric value in the input box. (But it doesn’t use real-world money for charge)
You can see the registered items in the Market page.
If you click any of the items, you can see the detail page of item. You can bet, or you are the seller, you can start raffling or delete the item.
You can register item through the + icon in the navbar. You can describe the details of the item such as name or image.
You can see your registered items in ‘My Listings’ page, and paid bets in ‘My Bets’ page.
If your registered item is sold or you won/lost the raffling, you get notification.
You can see your notifications in ‘Notifications’ page.
The overall rules of our site is described in ‘Rules’ page. You can read it on, https://amazino-3b363.firebaseapp.com/rules
FAQs of our site is described in ‘FAQ’ page, and ‘About Us’ page. If you have any problem in using our site, please contact us.
