import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';
class NavBarWithSignIn extends Component {

  constructor(props){
    super(props);
    this.sendToCreatePost = this.sendToCreatePost.bind(this);
  }

  sendToCreatePost() {
    if(this == undefined || this.context==undefined || this.context.user_name==undefined){
      window.location = "/login";
    }
    else{
      window.location = "/createpost";
    }
  }


  render(){
    return(
      <nav className="navbar navbar-inverse" data-spy="affix" data-offset-top="200">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <button onClick={this.sendToCreatePost()} type="button" className="btn btn-info">Create Post</button>
          </ul>
          <div className="navbar-header navbar-center">
            <a className="navbar-brand" href="/">MemeShare</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <button href="/login"><span className="btn btn-success"></span> Sign Up / Login</button>
          </ul>
        </div>
      </nav>
    );
  }


}

NavBarWithSignIn.contextType = UserContext;

export default NavBarWithSignIn;
