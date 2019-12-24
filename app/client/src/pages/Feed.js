import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import Posts from '../queries-mutations/Posts.js';
import FollowingIds from '../queries-mutations/FollowingIds.js';
import UserContext from '../contexts/UserContext.js';


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
        <div style={{color:"#9b9b9b", lineHeight: "1.3em", padding: "4em 0", textAlign: "center", fontSize: ".75rem"}}>
          <div style={{padding:"0 1.5em",  width:"100%", maxWidth:"940px", margin:"0 auto", boxSizing: "border-box", color:"#9b9b9b", lineHeight: "1.3em", textAlign: "center", fontSize: ".75rem"}}>
            <div style={{display:"block",  marginRight:".75em", boxSizing: "border-box", color:"#9b9b9b", lineHeight: "1.3em", textAlign: "center", fontSize: ".75rem"}}>
              <li style={{display: "inline", listStyle:"none", margin:"0", color:"#9b9b9b", boxSizing:"border-box", textAlign:"-webkit-match-parent", lineHeight: "1.3em", padding: "0", textAlign: "center", fontSize: ".75rem", color:"#9b9b9b"}}><a style={{textDecoration:"none", color:"#9b9b9b", marginBottom:"0", cursor: "pointer", transitionProperty:"color,background,text-shadow", transitionDuration:"0.2s", transitionTimingFunction:"ease-in-out"}} href="#``">Content Policy | </a></li>
              <li style={{display: "inline", listStyle:"none", margin:"0", color:"#9b9b9b", boxSizing:"border-box", textAlign:"-webkit-match-parent", lineHeight: "1.3em", padding: "0", textAlign: "center", fontSize: ".75rem", color:"#9b9b9b"}}><a style={{textDecoration:"none", color:"#9b9b9b", marginBottom:"0", cursor: "pointer", transitionProperty:"color,background,text-shadow", transitionDuration:"0.2s", transitionTimingFunction:"ease-in-out"}} href="#``">Privacy Policy | </a></li>
              <li style={{display: "inline", listStyle:"none", margin:"0", color:"#9b9b9b", boxSizing:"border-box", textAlign:"-webkit-match-parent", lineHeight: "1.3em", padding: "0", textAlign: "center", fontSize: ".75rem", color:"#9b9b9b"}}><a style={{textDecoration:"none", color:"#9b9b9b", marginBottom:"0", cursor: "pointer", transitionProperty:"color,background,text-shadow", transitionDuration:"0.2s", transitionTimingFunction:"ease-in-out"}} href="#``">User Agreement</a></li>
            </div>
            <span>© 2019 MemeSharer, inc. All rights reserved.</span>
          </div>
        </div>
      </div>
      );
    }
  }
};

Feed.contextType = UserContext;

export default Feed;
