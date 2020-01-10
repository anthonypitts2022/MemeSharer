import React from 'react';
import NavBarForSignInPage from '../components/navBarForSignInPage.jsx';
import LoginForm from '../components/loginForm.jsx';
import Footer from "../components/Footer.jsx"


const SignUpPage = () => (
  <div key="signUpPage">
    <NavBarForSignInPage key={"nav"} />
      <LoginForm key={"loginForm"} />
    <Footer/>
  </div>
);

export default SignUpPage;
