import React from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";


const CreateUser = gql`
  mutation createUser($input: createCommentInput){
    Comment: createComment(input: $input){
      errors{
        msg
      }
      id
      userId
      userName
      postId
      text
    }
  }
`
export default CreateUser;
