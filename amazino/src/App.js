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

import JunTest from './components/JunTestPlace';

class App extends Component {
  constructor() {
    super();
    fire();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Link to='/firebaseTest'>firebase</Link>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/item/:id' component={Listing} />
            <Route path='/market' component={Market} />
            <Route path='/create' component={CreateListing} />
            <Route path='/login' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/' component={Home} />

            <Route path='/firebaseTest' component={JunTest}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;