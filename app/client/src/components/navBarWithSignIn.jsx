import React, { Component } from 'react';


class NavBarWithSignIn extends Component {

  constructor(props){
    super(props);
    this.sendToLogin = this.sendToLogin.bind(this);
  }

  sendToLogin() {
    window.location = "/login";
  }


  render(){
    return(
      <nav className="navbar navbar-inverse" data-spy="affix" data-offset-top="200">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <button type="button" onClick={this.sendToLogin.bind(this)} className="btn btn-info">Create Post</button>
          </ul>
          <div className="navbar-header navbar-center">
            <a className="navbar-brand" href="/">MemeSharer</a>
          </div>
          <div className="navbar-header navbar-right">
            <button onClick={this.sendToLogin.bind(this)} type="button" className="btn btn-info btn-md">Login</button>
          </div>
        </div>
      </nav>
    );
  }


}


export default NavBarWithSignIn;
