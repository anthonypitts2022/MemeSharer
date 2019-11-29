import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './config/serviceWorker';
import "bootstrap/dist/css/bootstrap.css";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.js';
import RoutingPage from './RoutingPage.jsx';


const routing = (
    <RoutingPage/>
);


ReactDOM.render(routing, document.getElementById('root'))
serviceWorker.unregister();
