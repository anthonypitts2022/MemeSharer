import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "bootstrap/dist/css/bootstrap.css"
import PostBox from './components/postBox.jsx';
import NavBar from './components/navBar.jsx';

ReactDOM.render(
  <li>
    <NavBar />
    <PostBox />
  </li>

  , document.getElementById('root')
);
serviceWorker.unregister();
