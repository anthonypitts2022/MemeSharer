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
import axios from 'axios';
import UserContext from '../contexts/UserContext.js';


const userClient = new ApolloClient({
  uri: "http://localhost:3002/user"
});


class LoginForm extends Component {

  constructor(props){
    super(props);


    //bindings
    this.responseGoogle = this.responseGoogle.bind(this);

  }


  responseGoogle(response) {
    signIn = signIn.bind(this);
    signIn(response);
    async function signIn(response) {
      try{
        var variables={"input": { "googleEmail": response.profileObj.email } };

        //call add like mutation
        var loginUserResponse = await axios.post("http://localhost:3002/login", variables);
        console.log(response.profileObj)

        let newUser = {
          "name": response.profileObj.name,
          "email": response.profileObj.email,
          "imageUrl": response.profileObj.imageUrl
        };

        localStorage.setItem('user', JSON.stringify(newUser)); //JSON.parse(dict) to undo

        window.location = "/";

      }
      catch(err) {
        console.log(err);
      }
    }
  };


  render(){
    return(
      <div>
       <a>
         <meta name="google-signin-scope" content="profile email"></meta>
         <meta name="google-signin-client_id" content="476731474183-4tm8h88lu6tnba05q3e81ommb9g1t1oc.apps.googleusercontent.com"></meta>
         <script src="https://apis.google.com/js/platform.js" async defer></script>
       </a>
       <form className="bg-light" method="post">
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
                     <GoogleLogin
                       clientId="476731474183-u57mkkmp59abldh9ko2vvrk65f2md5i4.apps.googleusercontent.com"
                       render={renderProps => (
                         <input
                           type="image"
                           src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
                           onClick={renderProps.onClick}
                           disabled={renderProps.disabled}
                         />
                       )}
                       buttonText="Login"
                       onSuccess={this.responseGoogle}
                       onFailure={this.responseGoogle}
                       cookiePolicy={"single_host_origin"}
                     />
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
        </form>
    </div>
    );
  }
}

LoginForm.contextType = UserContext;

export default LoginForm;
