import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import CreatePostForm from '../components/createPostForm.jsx';


const Feed = () => (
  <li key="feed">
    <NavBarWithoutSignIn key={"navBarWithSignIn"} />
    <CreatePostForm key={"CreatePost"} />
  </li>
);

export default Feed;
