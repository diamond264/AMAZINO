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

import JunTest from './components/JunTestPlace';

class App extends Component {
  constructor() {
    super();
    fire();
  }
  componentWillMount() {
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