import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CheckLogin from '../queries-mutations/CheckLogin.js'
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import GoogleLogin from "react-google-login";

const userClient = new ApolloClient({
  uri: "http://localhost:3302/user"
});


class LoginForm extends Component {

  constructor(props){
    super(props);

    this.state = {};

    //bindings
    this.onSignIn = this.onSignIn.bind(this);


  }

  componentDidMount() {
    gapi.signin2.render('g-signin2', {
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'width': 200,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onSignIn
    });
  }

  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    this.setState({email: profile.getEmail()});
  }



  render(){
    return(
      <div>
       <a>
         <meta name="google-signin-scope" content="profile email"></meta>
         <meta name="google-signin-client_id" content="476731474183-4tm8h88lu6tnba05q3e81ommb9g1t1oc.apps.googleusercontent.com"></meta>
         <script src="https://apis.google.com/js/platform.js" async defer></script>
       </a>
       <div className="container">
          <div className="col-md-6 mx-auto text-center">
             <div className="jumbotron">
                <h1 className="wv-heading--title">
                   Create, Share, Explore Memes
                </h1>
                <p className="wv-heading--subtitle">
                   Sign in with Google today.
                </p>
             </div>
          </div>
          <div className="row">
             <div className="col-md-4 mx-auto">
                <div className="g-signin2" data-onsuccess="onSignIn"></div>
                <div className="col-md-12 ">
                   <div className="login-or">
                      <hr className="hr-or" />
                   </div>
                </div>
               <p className="small mt-3">By signing in, you are indicating that you have read and agree to the <a href="" className="ps-hero__content__link">Terms of Use</a> and <a href="#">Privacy Policy</a>.</p>
          </div>
       </div>
    </div>
    </div>
    );
  }
}

export default LoginForm;
