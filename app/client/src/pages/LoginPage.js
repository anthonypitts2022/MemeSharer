import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import LoginForm from '../components/loginForm.jsx';

const userClient = new ApolloClient({
  uri: "http://localhost:3302/user"
});

const SignUpPage = () => (
  <li key="signUpPage">
    <NavBarWithoutSignIn key={"nav"} />
    <ApolloProvider client={userClient}>
      <LoginForm key={"loginForm"} />
    </ApolloProvider>
  </li>
);

export default SignUpPage;
