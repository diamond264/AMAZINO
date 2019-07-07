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
    currentUid: ''
  }

  constructor() {
    super();
    
    fire();

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({
          currentUid: user.uid
        })
      } else {
        this.setState({
          currentUid: ''
        })
      }
      console.log(this.state.currentUid);
    })
  }

  
  

  render() {
    
    
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar user={this.state.currentUid}/>
          <Link to='/firebaseTest'>firebase</Link>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/item/:id' component={Listing} />
            <Route path='/market' component={Market} />
            <Route path='/create' component={CreateListing} />
            <Route path='/login' component={SignIn} />
            <Route path='/signup' component={SignUp} />
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