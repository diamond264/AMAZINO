import React, { Component } from 'react';
import { fire } from './shared/Firebase';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'

import Navbar from './components/navigation/Navbar';
import Home from './components/Home';
import CreateListing from './components/market/CreateListing';
import Market from './components/market/Market';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Listing from './components/market/Listing';
import Profile from './components/account/Profile';

import * as firebase from 'firebase/app';

import { auth } from 'firebase';
import JunTest from './components/JunTestPlace';

class App extends Component {
  state = {
    currentUser: null,
    currentUid: null
  }

  constructor() {
    super();
    
    fire();

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({
          currentUser: user,
          currentUid: user.uid
        })
      } else {
        this.setState({
          currentUser: null,
          currentUid: null
        })
      }
      console.log(this.state.currentUid);
    })
  }

  
  

  render() {
    
    
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar user={this.state.currentUser} />
          <Link to='/firebaseTest'>firebase</Link>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/listing/:id' component={Listing} />
            <Route path='/market' component={Market} />
            <Route path='/create' component={CreateListing} />
            <Route path='/signin' component={SignIn} {...this.state} />
            <Route path='/signup' component={SignUp} user={this.state.currentUser} />
            <Route path='/firebaseTest' component={JunTest}/>
            <Route path='/profile' component={Profile} />
            <Route path='/' component={Home} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;