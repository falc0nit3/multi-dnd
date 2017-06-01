import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import './static/styles/index.css';
import { Provider } from 'react-redux';


import Store from './app/store';
//const StoreInstance = Store();

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
