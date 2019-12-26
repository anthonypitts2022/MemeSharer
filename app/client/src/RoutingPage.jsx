import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Feed from './pages/Feed';
import Page404 from './pages/Page404';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import ContentPolicyPage from './pages/ContentPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import UserAgreementPage from './pages/UserAgreementPage';
import * as serviceWorker from './config/serviceWorker';
import "bootstrap/dist/css/bootstrap.css";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.js';



class RoutingPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      user_name: localStorage.getItem('user')==null ? undefined : JSON.parse(localStorage.getItem('user')).name.split(" ")[0],
      user_email: localStorage.getItem('user')==null ? undefined : JSON.parse(localStorage.getItem('user')).email,
      user_profileUrl: localStorage.getItem('user')==null ? undefined : JSON.parse(localStorage.getItem('user')).profileUrl,
      user_id: localStorage.getItem('user')==null ? undefined : JSON.parse(localStorage.getItem('user')).id,
    };
  }


  render(){
    return(
      <Router>
        <UserProvider value={this.state}>
          <Switch>
            <Route exact path="/" component={Feed} />
            <Route path="/login" component={LoginPage} />
            <Route path="/profile/:userId" component={ProfilePage} />
            <Route path="/createpost" component={CreatePostPage} />
            <Route path="/post/:postId" component={PostPage} />
            <Route path="/privacypolicy" component={PrivacyPolicyPage} />
            <Route path="/contentpolicy" component={ContentPolicyPage} />
            <Route path="/useragreement" component={UserAgreementPage} />
            <Route component={Page404} />
          </Switch>
        </UserProvider>
      </Router>
    );
  }
}

export default RoutingPage;
