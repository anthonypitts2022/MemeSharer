import React, { Component } from 'react';
import GoogleLogin from "react-google-login";
import UserContext from '../contexts/UserContext.js';
const { createApolloFetch } = require('apollo-fetch');
const { addReqHeaders } = require('../lib/addReqHeaders.js')
const { setResHeaders } = require('../lib/setResHeaders.js')




class LoginForm extends Component {

  constructor(props){
    super(props);

    //bindings
    this.responseGoogle = this.responseGoogle.bind(this);

  }

  
  responseGoogle(googleResponse) {
    signIn(googleResponse);
    async function signIn(googleResponse) {
      try{

        if(!googleResponse.profileObj || !googleResponse.profileObj.name 
          || !googleResponse.profileObj.email || !googleResponse.profileObj.googleId 
          || !googleResponse.profileObj.imageUrl)
        {
          console.log("Invalid response from google login.");
          return
        }

        //clear all current user data in local storage
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')

        //calls backend mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //sets the authorization request header
        addReqHeaders(fetch);
        //get the response authorization header and store in localStorage
        setResHeaders(fetch)

        fetch = fetch.bind(googleResponse)
        var loginResponse = await fetch({
          query:
          `
          mutation createOrUpdateUser($input: CreateUserInput){
            User: createOrUpdateUser(input: $input){
              errors{
                msg
              }
              id
              name
              email
              profileUrl
            }
          }
          `,
          variables: {
            input: {
              id: googleResponse.profileObj.googleId,
              email: googleResponse.profileObj.email,
              name: googleResponse.profileObj.name,
              profileUrl: googleResponse.profileObj.imageUrl
            }
          }
        })

        //check if valid return from login mutation
        if(!loginResponse.data || !loginResponse.data.User || loginResponse.data.User.errors){
          console.log("error in login: "+JSON.stringify(loginResponse.data && loginResponse.data.User && loginResponse.data.User.errors));
          return
        }


        localStorage.setItem('user', JSON.stringify(loginResponse.data.User)); //JSON.parse(dict) to undo

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

       <meta name="google-signin-scope" content="profile email"></meta>
       <meta name="google-signin-client_id" content={`${process.env.REACT_APP_googleSignInClientID}`}></meta>
       <script src="https://apis.google.com/js/platform.js" async defer></script>

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
                       clientId={`${process.env.REACT_APP_googleSignInClientID}`}
                       render={renderProps => (
                         <input
                           id="loginInput"
                           type="image"
                           src="/btn_google_signin_dark_normal_web.png"
                           onClick={renderProps.onClick}
                           disabled={renderProps.disabled}
                           alt="Google login image"
                         />
                       )}
                       buttonText="Login"
                       onSuccess={this.responseGoogle}
                       onFailure={this.responseGoogle}
                       cookiePolicy={`${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}`}

                     />
                    <div className="g-signin2" data-onsuccess="onSignIn"></div>
                    <div className="col-md-12 ">
                       <div className="login-or">
                          <hr className="hr-or" />
                       </div>
                    </div>
                   <p className="small mt-3">By signing in, you are indicating that you have read and agree to the <a href="/contentpolicy" className="ps-hero__content__link">Terms of Use</a> and <a href="/privacypolicy">Privacy Policy</a>.</p>
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
