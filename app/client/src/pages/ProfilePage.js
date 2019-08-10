import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import CurrentUserPosts from '../queries-mutations/CurrentUserPosts.js'

const postsClient = new ApolloClient({
  uri: "http://localhost:3301/posts"
});

const Feed = () => (
  <li key="feed">
    <NavBarWithoutSignIn key={"navBarWithSignIn"} />
    <ApolloProvider client={postsClient}>
      <CurrentUserPosts key={"profilePosts"} />
    </ApolloProvider>
  </li>
);

export default Feed;
