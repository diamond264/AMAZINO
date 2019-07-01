import React, { Component } from 'react';
import { fire } from './shared/Firebase';

class App extends Component {
  constructor() {
    super();
    fire();
  }

  render() {
    return (
      <div className="App">
       <h1>AMAZINO</h1>
      </div>
    );
  }
}

export default App;