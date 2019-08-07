import React from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import PostBox from './components/postBox.jsx';
import NavBar from './components/navBar.jsx';
import Posts from './Posts.js'

const client = new ApolloClient({
  uri: "http://localhost:3301/posts"
});

const App = () => (
  <ApolloProvider client={client}>
    <li>
      <NavBar key={"nav"} />
      <Posts key={"posts"} />
    </li>
  </ApolloProvider>
);

export default App;
