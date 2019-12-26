import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import Posts from '../queries-mutations/Posts.js';
import Post from '../queries-mutations/Post.jsx';
import FollowingIds from '../queries-mutations/FollowingIds.js';
import UserContext from '../contexts/UserContext.js';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PostBox from '../components/postBox.jsx';


const postsClient = new ApolloClient({
  uri: "http://localhost:3301/posts"
});



class PostPage extends Component {

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
      <div key="postpage">
        <NavBarWithSignIn key="navBarWithSignIn" />
        <ApolloProvider client={postsClient}>
        <Query
          query={gql`
            query getAPost($id: String!){
              Post: getAPost(id: $id){
                errors{
                  msg
                }
                fileId
                fileType
                userId
                user{
                  id
                  name
                  email
                  profileUrl
                }
                id
                caption
                likeCount
                dislikeCount
                comments{
                  text
                  userId
                  user{
                    id
                    name
                    email
                    profileUrl
                  }
                  id
                }
              }
            }
          `}
          variables={{id: this.props.match.params.postId}}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            return(
              <div>
                {data.Post.map(postInfo => (
                  <div key={postInfo.id}>
                    <PostBox postInfo={postInfo}/>
                    <p></p>
                  </div>
                ))}
              </div>
            );
          }}
        </Query>
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
    else{
      return(
      <div key="postpage">
        <NavBarWithoutSignIn key="navBarWithoutSignIn" />
        <ApolloProvider client={postsClient}>
        <Query
          query={gql`
            query getAPost($id: String!){
              Post: getAPost(id: $id){
                errors{
                  msg
                }
                fileId
                fileType
                userId
                user{
                  id
                  name
                  email
                  profileUrl
                }
                id
                caption
                likeCount
                dislikeCount
                comments{
                  text
                  userId
                  user{
                    id
                    name
                    email
                    profileUrl
                  }
                  id
                }
              }
            }
          `}
          variables={{id: this.props.match.params.postId}}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            return(
              <PostBox postInfo={data.Post}/>
            );
          }}
        </Query>
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

PostPage.contextType = UserContext;

export default PostPage;
