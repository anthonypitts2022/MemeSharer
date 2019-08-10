import React, { Component } from 'react';

class NavBarWithoutSignIn extends Component {

  render(){
    return(
      <nav className="navbar navbar-inverse" data-spy="affix" data-offset-top="200">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">MemeShare</a>
          </div>
        </div>
      </nav>
    );
  }


}

export default NavBarWithoutSignIn;
