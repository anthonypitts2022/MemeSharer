import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Feed from './pages/Feed';
import SignUpPage from './pages/SignUpPage';
import Page404 from './pages/Page404';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import * as serviceWorker from './config/serviceWorker';
import "bootstrap/dist/css/bootstrap.css";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.js';


class RoutingPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      user_name: JSON.parse(localStorage.getItem('user')).name.split(" ")[0] || undefined,
      user_email: JSON.parse(localStorage.getItem('user')).email || undefined,
      user_imageUrl: JSON.parse(localStorage.getItem('user')).imageUrl || undefined,
    };
  }


  render(){
    return(
      <Router>
        <UserProvider value={this.state}>
          <Switch>
            <Route exact path="/" component={Feed} />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/createpost" component={CreatePostPage} />
            <Route component={Page404} />
          </Switch>
        </UserProvider>
      </Router>
    );
  }
}

export default RoutingPage;
