import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CheckLogin from '../queries-mutations/CheckLogin.js'



class LoginForm extends Component {

  constructor(props){
    super(props);

    this.state = {

    };

    //bindings
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

  }


  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  render(){
    return(
      <div>
       <div className="container">
          <div className="col-md-6 mx-auto text-center">
             <div className="jumbotron">
                <h1 className="wv-heading--title">
                   Create, Share, Explore Memes
                </h1>
                <p className="wv-heading--subtitle">
                   Sign in today.
                </p>
             </div>
          </div>
          <div className="row">
             <div className="col-md-4 mx-auto">
                <div className="myform form ">
                   <form name="signup">
                      <div className="form-group">
                         <input onChange={this.handleEmailChange} type="email" name="email"  className="form-control my-input" id="email" placeholder="Email" />
                      </div>
                      <div className="form-group">
                         <input onChange={this.handlePasswordChange} type="password" name="password"  className="form-control" id="password" placeholder="Password" />
                      </div>
                  </form>
                </div>
                <Mutation mutation={CheckLogin} variables={{"input": { "name": this.state.name, "email": this.state.email, "password": this.state.password, "password2": this.state.password2 } }}>
                  {checkLogin => <button onClick={checkLogin} type="submit" className="btn btn-lg btn-primary btn-block ">Sign In</button>}
                </Mutation>
                <div className="col-md-12 ">
                   <div className="login-or">
                      <hr className="hr-or" />
                      <span className="span-or">or</span>
                   </div>
                </div>
                <div className="form-group">
                   <input type="image" src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"/>
                </div>
                <p className="small mt-3">By signing up, you are indicating that you have read and agree to the <a href="" className="ps-hero__content__link">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                </p>
             </div>
          </div>
       </div>
    </div>
    );
  }



}

export default LoginForm;
