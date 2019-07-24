import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import {getAllItems, numOfItems} from "./shared/Firebase";

import Navbar from './components/navigation/Navbar';
import CreateListing from './components/market/CreateListing';
import Market from './components/market/Market';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Listing from './components/market/Listing';
import Profile from './components/account/Profile';
import UserListings from './components/account/UserListings';
import UserBets from './components/account/UserBets';
import AboutUs from './components/account/AboutUs';
import Rules from './components/account/Rules';
import Notifications from './components/account/Notifications';
import './App.css';


import * as firebase from 'firebase/app';

class App extends Component {
  state = {
    currentUser: null,
    search: "",
    data: null,
    maxPages: 0,
    filter: {
      Animals: false,
      Cars: false,
      Clothing: false,
      Cooking: false,
      Electronics: false,
      Garden: false,
      Tools: false,
      Sports: false,
      Other: false,
    }
  }

  constructor() {
    super();
    
    this.getData = this.getData.bind(this);

    // auth state listener
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({
          currentUser: user
        })
      } else {
        this.setState({
          currentUser: null
        })
      }
      console.log(this.state.currentUser);
    })
  }

  /**
   * Update search query for the market
   * 
   * @param {string} str - Search query string
   */
  updateSearch = (str) => {
    this.setState({
      search: str
    })
    this.getData(str, this.state.filter, 1);
  }

  updateFilter = (e) => {
    var filter = this.state.filter;
    filter[e.target.name] = !this.state.filter[e.target.name]
    this.setState({
      filter
    })
    this.getData(this.state.search, filter, 1)
  }

  /**
   * Calls getData with pageNumber provided
   * 
   * @param {int} pageNumber
   */
  updatePage = (pageNumber) => {
    this.getData("", this.state.filter, pageNumber);
  }

  /**
   * Gets item data from database, stores in state
   * 
   * @param {string} str - String to search for, empty if no query
   * @param {Object} filter - Object containing categories to filter
   * @param {int} page - Page of items to return
   */
  async getData(str, filter, page) {
    var itemsPerPage = 20;
    await getAllItems(itemsPerPage, page, str, filter)
        .then(items => {
            if(items) {  
                numOfItems(str, filter).then(num => {
                  var maxPages = Math.ceil(num / itemsPerPage);
                  this.setState({
                    data: items,
                    maxPages
                  });
                })
            }
        });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar {...this.state} updateSearch={this.updateSearch} />
          {/*<Link to='/firebaseTest'>firebase</Link>*/}
          <Switch>
            <Route exact path='/' render={(props) => 
              <Market {...props} {...this.state} getData={this.getData} updatePage={this.updatePage} updateFilter={this.updateFilter}/>}
              />
            <Route path='/listing/:id'  render={(props) => <Listing {...props} {...this.state}/>} />
            <Route path='/user/:id' render={(props) => <Profile {...props} {...this.state} />} />
            <Route path='/profile' render={() => <Redirect to={"/user/" + this.state.currentUser.uid} />} />
            <Route path='/market' render={() => <Redirect to="/" />}/>
            <Route path='/create' render={(props) => <CreateListing {...props} {...this.state} />} />
            <Route path='/signin' component={() => <SignIn {...this.state} />} />
            <Route path='/signup' component={() => <SignUp {...this.state} />} />
            <Route path='/aboutus' component={AboutUs} />
            <Route path='/rules' component={Rules} />
            <Route path='/listings' render={(props) => <UserListings {...props} {...this.state} />} />
            <Route path='/bets' render={(props) => <UserBets {...props} {...this.state} />} />
            <Route path='/notifications' render={(props) => <Notifications {...props} {...this.state} />} />
            <Route path='/' render={() => <Redirect to="/" />} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;