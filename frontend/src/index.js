import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './styles/index.css';
import './styles/variables.css';
import './styles/themes.css';

// Suppress the ReactDOM.render warning
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*ReactDOM.render is no longer supported/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);