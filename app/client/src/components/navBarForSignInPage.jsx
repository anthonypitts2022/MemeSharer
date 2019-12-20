import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';
import { Image } from 'react-native';



class NavBarForSignInPage extends Component {

  constructor(props){
    super(props);
  }

  render(){
    return(
      <nav className="navbar navbar-inverse" data-spy="affix" data-offset-top="200">
        <div className="container-fluid">
          <div className="navbar-header navbar-center">
            <a className="navbar-brand" href="/">MemeShare</a>
          </div>
        </div>
      </nav>
    );
  }


}

NavBarForSignInPage.contextType = UserContext;


export default NavBarForSignInPage;
