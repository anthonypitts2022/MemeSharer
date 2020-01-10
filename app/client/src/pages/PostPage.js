import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import UserContext from '../contexts/UserContext.js';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PostBox from '../components/postBox.jsx';
import Footer from "../components/Footer.jsx"



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

    let navBar;
    if(this.navBarType()==="navBarWithSignIn")
        navBar = <NavBarWithSignIn key="navBarWithSignIn" id="navPostPage"/>
    else
        navBar = <NavBarWithoutSignIn key="navBarWithoutSignIn" id="navPostPage"/>

    return(
    <div key="postpage">
      {navBar}
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
          let postInfo = data.Post;
          return(
            <div>
              <div key={postInfo.id}>
                <PostBox postInfo={postInfo}/>
                <p></p>
              </div>
            </div>
          );
        }}
      </Query>
      </ApolloProvider>
      <Footer/>
    </div>
    );
  }
};

PostPage.contextType = UserContext;

export default PostPage;
