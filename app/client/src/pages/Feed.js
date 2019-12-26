import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import Posts from '../queries-mutations/Posts.js';
import FollowingIds from '../queries-mutations/FollowingIds.js';
import UserContext from '../contexts/UserContext.js';
import Footer from "../components/Footer.jsx"



const postsClient = new ApolloClient({
  uri: "http://localhost:3301/posts"
});



class Feed extends Component {

  constructor(props){
    super(props);
    this.navBarType = this.navBarType.bind(this);
  }

  navBarType() {
    return (this===undefined || this.context===undefined || this.context.user_name===undefined)
              ? "navBarWithSignIn" : "navBarWithoutSignIn";
  }

  render(){
    if(this.navBarType()==="navBarWithSignIn")
    {
      return(
      <div key="feed">
        <NavBarWithSignIn key="navBarWithSignIn" />
        <ApolloProvider client={postsClient}>
          <Posts key={"posts"} />
        </ApolloProvider>
        <Footer/>
      </div>
      );
    }
    else{
      return(
      <div key="feed">
        <NavBarWithoutSignIn key="navBarWithoutSignIn" />
        <ApolloProvider client={postsClient}>
          <Posts key={"posts"} />
        </ApolloProvider>
        <Footer/>
      </div>
      );
    }
  }
};

Feed.contextType = UserContext;

export default Feed;
