import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarForSignInPage from '../components/navBarForSignInPage.jsx';
import LoginForm from '../components/loginForm.jsx';
import Footer from "../components/Footer.jsx"


const userClient = new ApolloClient({
  uri: "http://localhost:3302/user"
});

const SignUpPage = () => (
  <div key="signUpPage">
    <NavBarForSignInPage key={"nav"} />
    <ApolloProvider client={userClient}>
      <LoginForm key={"loginForm"} />
    </ApolloProvider>
    <Footer/>
  </div>
);

export default SignUpPage;
