import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import CreateUser from '../queries-mutations/CreateUser.js'





class SignUpForm extends Component {

  constructor(props){
    super(props);

    this.state = {

    };

    //bindings
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);

  }


  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }
  handlePassword2Change(event) {
    this.setState({password2: event.target.value});
  }

  render(){
    return(
      <div>
       <div className="container">
          <div className="col-md-6 mx-auto text-center">
             <div className="jumbotron">
                <h1 className="wv-heading--title">
                   Explore the world of memes
                </h1>
                <p className="wv-heading--subtitle">
                   Sign up today.
                </p>
             </div>
          </div>
          <div className="row">
             <div className="col-md-4 mx-auto">
                <div className="myform form ">
                   <form name="signup">
                      <div className="form-group">
                         <input onChange={this.handleNameChange} type="text" name="name"  className="form-control my-input" id="name" placeholder="Name" />
                      </div>
                      <div className="form-group">
                         <input onChange={this.handleEmailChange} type="email" name="email"  className="form-control my-input" id="email" placeholder="Email" />
                      </div>
                      <div className="form-group">
                         <input onChange={this.handlePasswordChange} type="password" name="password"  className="form-control" id="password" placeholder="Password" />
                      </div>
                      <div className="form-group">
                         <input onChange={this.handlePassword2Change} type="password" name="password2"  className="form-control" id="password2" placeholder="Re-enter Password" />
                      </div>
                  </form>
                </div>
                <Mutation mutation={CreateUser} variables={{"input": { "name": this.state.name, "email": this.state.email, "password": this.state.password, "password2": this.state.password2 } }}>
                  {createUser => <button onClick={createUser} type="submit" className="btn btn-lg btn-primary btn-block ">Sign Up</button>}
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

export default SignUpForm;
