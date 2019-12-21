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
  </li>
);

export default Feed;
