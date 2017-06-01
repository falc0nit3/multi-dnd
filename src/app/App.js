import React, { Component } from 'react';
import './App.css';
import Routes from './routes/routes';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="surface" className='body-content'>
          <div id="content">
            <Routes />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
