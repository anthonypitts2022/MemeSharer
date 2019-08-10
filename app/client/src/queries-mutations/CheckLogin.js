import React from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";


const CheckLogin = () => (
  <Query
    query={gql`
      query checkLogin($input: LoginInput){
        checkLogin(input: $input)
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      console.log(data.checkLogin);
      if(data.checkLogin==true){
        return(
          <p key="loginSuccess">Login Successful!</p>
        );
      }
      else{
        return(
          <p key="loginFailed">Invalid Login.</p>
        )
      }
    }}
  </Query>
);
export default CheckLogin;
