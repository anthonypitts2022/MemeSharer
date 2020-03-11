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
  uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
});



class PostPage extends Component {

  constructor(props){
    super(props);
    this.navBarType = this.navBarType.bind(this);
    this.postId = this.props.match.params.postId;
  }


  navBarType() {
    return ( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined )
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
        variables={{id: this.postId}}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return(
            <div>
              <div key={data.Post.id}>
                <PostBox postInfo={data.Post}/>
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
