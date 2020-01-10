import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';


class NavBarWithoutSignIn extends Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <nav className="navbar navbar-inverse" data-spy="affix" data-offset-top="200">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
          </ul>
          <div className="navbar-header navbar-center">
            <a className="navbar-brand" href="/">MemeSharer</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
          </ul>
        </div>
      </nav>
    );
  }


}

NavBarWithoutSignIn.contextType = UserContext;


export default NavBarWithoutSignIn;
