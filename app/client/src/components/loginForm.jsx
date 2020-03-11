import React, { Component } from 'react';
import GoogleLogin from "react-google-login";
import axios from 'axios';
import UserContext from '../contexts/UserContext.js';



class LoginForm extends Component {

  constructor(props){
    super(props);


    //bindings
    this.responseGoogle = this.responseGoogle.bind(this);



  }


  responseGoogle(response) {
    signIn(response);
    async function signIn(response) {
      try{

        if(response.profileObj === undefined){
          return
        }

        //put user in local storage
        let newUser = {
          "name": response.profileObj.name,
          "email": response.profileObj.email,
          "profileUrl": response.profileObj.imageUrl,
          "id": response.profileObj.googleId
        };
        localStorage.setItem('user', JSON.stringify(newUser)); //JSON.parse(dict) to undo

        //create new user in database or update user if logged in before
        var variables = { "input": newUser };

        await axios.post(`${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_userms_port}/createupdateuser`, variables);

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
       <meta name="google-signin-client_id" content="544936028407-cfo7s4fd5fpcd8n2ttoat5h8438dk7gq.apps.googleusercontent.com"></meta>
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
                       clientId="476731474183-m4mk97e3v7hikda986n95qih07eqpi2e.apps.googleusercontent.com"
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
                       cookiePolicy={"http://localhost"}

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
