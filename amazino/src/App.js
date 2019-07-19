import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import {getAllItems} from "./shared/Firebase";

import Navbar from './components/navigation/Navbar';
import CreateListing from './components/market/CreateListing';
import Market from './components/market/Market';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Listing from './components/market/Listing';
import Profile from './components/account/Profile';
import UserListings from './components/account/UserListings';
import UserBets from './components/account/UserBets';
import Notifications from './components/account/Notifications';

import * as firebase from 'firebase/app';

class App extends Component {
  state = {
    currentUser: null,
    search: "",
    data: null,
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

  updateSearch = (str) => {
    this.setState({
      search: str
    })
    this.getData(str, this.state.filter);
  }

  updateFilter = (e) => {
    var filter = this.state.filter;
    filter[e.target.name] = !this.state.filter[e.target.name]
    this.setState({
      filter
    })
    this.getData(this.state.search, filter)
  }

  async getData(str, filter) {
    await getAllItems(20, 1, str, filter)
        .then(items => {
            if(items) {
                this.setState({
                    data: items
                });
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
              <Market {...props} {...this.state} getData={this.getData} updateFilter={this.updateFilter}/>}
              />
            <Route path='/listing/:id'  render={(props) => <Listing {...props} {...this.state}/>} />
            <Route path='/market' render={() => <Redirect to="/" />}/>
            <Route path='/create' render={(props) => <CreateListing {...props} {...this.state} />} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/profile' render={(props) => <Profile {...props} {...this.state} />} />
            <Route path='/listings' render={(props) => <UserListings {...props} {...this.state} />} />
            <Route path='/bets' render={(props) => <UserBets {...props} {...this.state} />} />
            <Route path='/notifications' render={(props) => <Notifications {...props} {...this.state} />} />
            <Route path='/' component={Market} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;