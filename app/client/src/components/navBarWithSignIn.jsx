import React, { Component } from 'react';

class NavBarWithSignIn extends Component {

  render(){
    return(
      <nav className="navbar navbar-inverse" data-spy="affix" data-offset-top="200">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <a href="/createpost" className="glyphicon glyphicon-user">Create Post</a>
          </ul>
          <div className="navbar-header navbar-center">
            <a className="navbar-brand" href="/">MemeShare</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <a href="/signup"><span className="glyphicon glyphicon-user"></span> Sign Up</a>
            <a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a>
          </ul>
        </div>
      </nav>
    );
  }


}

export default NavBarWithSignIn;
