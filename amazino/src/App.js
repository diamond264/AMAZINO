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
    currentUser: null
  }

  constructor() {
    super();
    
    fire();

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

  
  

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar {...this.state} />
          <Link to='/firebaseTest'>firebase</Link>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/listing/:id' component={Listing} />
            <Route path='/market' component={Market} />
            <Route path='/create' render={(props) => <CreateListing {...this.state} />} />
            <Route path='/signin' component={SignIn} />
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