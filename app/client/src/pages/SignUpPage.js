import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import SignUpForm from '../components/signUpForm.jsx';

const userClient = new ApolloClient({
  uri: "http://localhost:3302/user"
});

const SignUpPage = () => (
  <li key="signUpPage">
    <NavBarWithoutSignIn key={"nav"} />
    <ApolloProvider client={userClient}>
      <SignUpForm key={"signUpForm"} />
    </ApolloProvider>
  </li>
);

export default SignUpPage;
