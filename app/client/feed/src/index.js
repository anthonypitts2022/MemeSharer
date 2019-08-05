import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "bootstrap/dist/css/bootstrap.css"
import PostBox from './components/postBox.jsx';
import NavBar from './components/navBar.jsx';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'http://localhost:3301/posts'
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <li>
      <NavBar />
      <PostBox />
    </li>
  </ApolloProvider>

  , document.getElementById('root')
);
serviceWorker.unregister();
