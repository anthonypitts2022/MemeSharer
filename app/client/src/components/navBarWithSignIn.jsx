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
      <div className="container-fluid">
        <div className="row" >

          <div className="col-4 " >
            <button type="button" onClick={this.sendToLogin.bind(this)} className="btn btn-info btn-md">Create Post</button>
            <p></p>
          </div>

          <div className="col-4 text-center" >
            <a className="navbar-brand" href="/">MemeSharer</a>
          </div>

          <div className="col-4 text-right">
            <button onClick={this.sendToLogin.bind(this)} type="button" className="btn btn-info btn-md">Login</button>
          </div>

        </div>
      </div>
    );
  }


}


export default NavBarWithSignIn;
