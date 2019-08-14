import React from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";


const CreatePost = gql`
  mutation createPost($input: createPostInput){
    Post: createPost(input: $input){
        errors{
          msg
        }
        userId
        id
        caption
        likeCount
        dislikeCount
        comments{
          text
          userId
        }
    }
  }
`;

export default CreatePost;
