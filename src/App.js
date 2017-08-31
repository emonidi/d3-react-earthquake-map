import React, { Component } from 'react';
import './App.css';
import Map from './map/map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map className="Map" width={window.innerWidth} height={window.innerHeight}></Map>
      </div>
    );
  }
}

export default App;
