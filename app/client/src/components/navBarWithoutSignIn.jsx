import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';
import { Image } from 'react-native';



class NavBarWithoutSignIn extends Component {

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
            <font color="006699"><span className="glyphicon glyphicon-user"></span>Welcome back,</font>
            <font color="006699"><span className="glyphicon glyphicon-user"></span>{this.context.user_name}</font>
            <Image
              source={{uri: this.context.user_imageUrl}}
              style={{width: 60, height: 60, borderRadius: 60/ 2}}
            />
          </ul>
        </div>
      </nav>
    );
  }


}

NavBarWithoutSignIn.contextType = UserContext;


export default NavBarWithoutSignIn;
