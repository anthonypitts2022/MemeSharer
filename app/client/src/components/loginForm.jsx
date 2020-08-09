import React, { Component } from 'react';
import GoogleLogin from "react-google-login";
import UserContext from '../contexts/UserContext.js';

//MemeSharer API
const { createUpdateUser } = require('../APIFetches/createUpdateUser.js')
const { getAuthTokens } = require('../APIFetches/getAuthTokens.js')


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
        
        if(!googleResponse || !googleResponse.tokenId){
          console.log("Invalid response from google login.");
          return
        }

        var google_id_token = googleResponse.tokenId
        
        //clear all current user data in local storage
        localStorage.removeItem('user')

        //call get Auth Tokens API on Auth MicroService
        var getAuthTokensResponse = await getAuthTokens(google_id_token);
        if(getAuthTokensResponse.errors || !getAuthTokensResponse.data || !getAuthTokensResponse.data.getAuthTokensFromLogin){
          console.log('failed to get access and refresh tokens from auth microservice');
          return
        }

        //call create update user API on user MicroService
        var createUpdateUserResponse = await createUpdateUser(google_id_token)
        if(!createUpdateUserResponse || !createUpdateUserResponse.data || !createUpdateUserResponse.data.User || createUpdateUserResponse.data.errors){
          console.log('Failed to create or update user');
          return
        }
        
        //set user object and go to the home page
        localStorage.setItem('user', JSON.stringify(createUpdateUserResponse.data.User)); //JSON.parse(dict) to undo
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
