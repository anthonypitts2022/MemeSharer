import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import Posts from '../queries-mutations/Posts.js'

const postsClient = new ApolloClient({
  uri: "http://localhost:3301/posts"
});

const Feed = () => (
  <li key="feed">
    <NavBarWithSignIn key={"navBarWithSignIn"} />
    <ApolloProvider client={postsClient}>
      <Posts key={"posts"} />
    </ApolloProvider>
  </li>
);

export default Feed;
