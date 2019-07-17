import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Navbar from './components/navigation/Navbar';
import CreateListing from './components/market/CreateListing';
import Market from './components/market/Market';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Listing from './components/market/Listing';
import Profile from './components/account/Profile';

import * as firebase from 'firebase/app';

class App extends Component {
  state = {
    currentUser: null
  }

  constructor() {
    super();
    

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
          {/*<Link to='/firebaseTest'>firebase</Link>*/}
          <Switch>
            <Route exact path='/' component={Market}/>
            <Route path='/listing/:id'  render={(props) => <Listing {...props} {...this.state}/>} />
            <Route path='/market' component={Market} />
            <Route path='/create' render={(props) => <CreateListing {...props} {...this.state} />} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/profile' render={(props) => <Profile {...props} {...this.state} />} />
            <Route path='/' component={Market} />

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;