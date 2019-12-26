import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import FollowingIds from '../queries-mutations/FollowingIds.js';
import UserContext from '../contexts/UserContext.js';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PostBox from '../components/postBox.jsx';
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
          <Query
            query={gql`
              query userPosts($userId: String!){
                Post: userPosts(userId: $userId){
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
            variables={{userId: this.props.match.params.userId}}
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
        <Footer/>
      </div>
      );
    }
    else{
      return(
      <div key="feed">
        <NavBarWithoutSignIn key="navBarWithoutSignIn" />
        <ApolloProvider client={postsClient}>
          <Query
            query={gql`
              query userPosts($userId: String!){
                Post: userPosts(userId: $userId){
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
            variables={{userId: this.props.match.params.userId}}
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
        <Footer/>
      </div>
      );
    }
  }
};

Feed.contextType = UserContext;

export default Feed;
