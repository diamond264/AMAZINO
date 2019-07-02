import React, { Component } from 'react';
import { fire } from './shared/Firebase';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'

import Navbar from './components/navigation/Navbar';
import Home from './components/Home';
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
            <Route path='/firebaseTest' component={JunTest}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;