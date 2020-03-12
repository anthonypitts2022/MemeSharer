import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';
import { Image } from 'react-native';
import { Icon } from '@iconify/react';
import signOutAlt from '@iconify/icons-fa-solid/sign-out-alt';




class NavBarWithoutSignIn extends Component {

  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
    this.createpost = this.createpost.bind(this);
  }

  logout() {
    localStorage.removeItem('user');
    window.location = "/login"
  }

  createpost() {
    window.location = "/createpost"
  }

  render(){
    return(
        <div className="container-fluid">
          <div className="row" >

            <div className="col-4 " >
              <button type="button" onClick={this.createpost.bind(this)} className="btn btn-info btn-sm">Create Post</button>
            </div>

            <div className="col-4 text-center" >
              <a className="navbar-brand" href="/">MemeSharer</a>
            </div>

            <div className="col-4 ">
              <div className="container">
                <div className="row">
                  <div className="col-4 ">
                  </div>
                  <div className="col-4 ">
                    <div className="container">
                      <div className="row">
                        <div className="col-6">
                          <a href={"/profile/"+JSON.parse(localStorage.getItem('user')).id}>
                            <Image
                              source={{uri: this.context.user_profileUrl}}
                              style={{width: 30, height: 30, borderRadius: 30/ 2}}
                            />
                          </a>
                        </div>
                        <div className="col-6">
                          <button onClick={this.logout.bind(this)} type="button" className="btn btn-info btn-sm"><Icon icon={signOutAlt} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
    );
  }


}

NavBarWithoutSignIn.contextType = UserContext;


export default NavBarWithoutSignIn;
