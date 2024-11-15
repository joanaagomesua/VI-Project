import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';


ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);