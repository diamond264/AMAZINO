import React, { Component } from 'react';
import { fire } from './shared/Firebase';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Navbar from './components/navigation/Navbar';
import Home from './components/Home';

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
            <Route path='/' component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;