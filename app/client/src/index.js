import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './config/serviceWorker';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.js';
import RoutingPage from './RoutingPage.jsx';


const routing = (
    <div style={{backgroundColor: '#e0e0eb', overflowX:"hidden"}} id="body">
      <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>
      <script type="text/javascript" src="Scripts/bootstrap.min.js"></script>
      <RoutingPage/>
    </div>
);


ReactDOM.render(routing, document.getElementById('root'))
serviceWorker.unregister();
