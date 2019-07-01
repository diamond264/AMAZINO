import React, { Component } from 'react';
import { fire } from './shared/Firebase';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Navbar from './components/navigation/Navbar';
import Home from './components/Home';
import CreateListing from './components/market/CreateListing';
import Market from './components/market/Market';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

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
          <Switch>
            <Route path='/market' component={Market} />
            <Route path='/create' component={CreateListing} />
            <Route path='/login' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/' component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;