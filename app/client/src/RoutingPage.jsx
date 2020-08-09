import React, { Component } from 'react';
import Feed from './pages/Feed';
import Page404 from './pages/Page404';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import ContentPolicyPage from './pages/ContentPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import UserAgreementPage from './pages/UserAgreementPage';
import "bootstrap/dist/css/bootstrap.css";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext.js';
const { refreshAccessToken } = require('./APIFetches/refreshAccessToken')




class RoutingPage extends Component {

  constructor(props){
    super(props);

    //parse the userInfo object in localStorage
    var userInfo = localStorage.getItem('user')
    if(userInfo)
      userInfo = JSON.parse(userInfo)

    this.state = {
      user_name: userInfo && userInfo.name && userInfo.name.split(" ")[0],
      user_email: userInfo && userInfo.email,
      user_profileUrl: userInfo && userInfo.profileUrl,
      user_id: userInfo && userInfo.id,
    };

    // Refresh access token every 10 minutes
    window.setInterval(async function(){ await refreshAccessToken() }, 600000)

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
