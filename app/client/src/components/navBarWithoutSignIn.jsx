import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';
import { Image } from 'react-native';



class NavBarWithoutSignIn extends Component {

  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
    this.createpost = this.createpost.bind(this);
  }

  logout() {
    localStorage.removeItem('user');
    window.location = "/"
  }

  createpost() {
    window.location = "/createpost"
  }

  render(){
    return(
      <nav className="navbar navbar-inverse" data-spy="affix" data-offset-top="200">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <button type="button" onClick={this.createpost.bind(this)} className="btn btn-info">Create Post</button>
          </ul>
          <div className="navbar-header navbar-center">
            <a className="navbar-brand" href="/">MemeSharer</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <font color="006699"><span className="glyphicon glyphicon-user"></span>Welcome back,</font>
            <font color="006699"><span className="glyphicon glyphicon-user"></span>{this.context.user_name}</font>
            <div className="row">
              <div className="column">
                <a href={"/profile/"+this.context.user_id}>
                  <Image
                    source={{uri: this.context.user_profileUrl}}
                    style={{width: 60, height: 60, borderRadius: 60/ 2}}
                  />
                </a>
              </div>
              <ul>
                <button onClick={this.logout.bind(this)} type="button" className="btn btn-info btn-sm">Logout</button>
              </ul>
            </div>
          </ul>
        </div>
      </nav>
    );
  }


}

NavBarWithoutSignIn.contextType = UserContext;


export default NavBarWithoutSignIn;
