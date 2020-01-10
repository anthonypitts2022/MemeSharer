import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import FollowingIds from '../queries-mutations/FollowingIds.js';
import UserContext from '../contexts/UserContext.js';
import Footer from "../components/Footer.jsx";
import PostBox from '../components/postBox.jsx';
import { Query } from "react-apollo";
import gql from "graphql-tag";
const { createApolloFetch } = require('apollo-fetch');




const postsClient = new ApolloClient({
  uri: "http://localhost:3301/posts"
});

class Feed extends Component {

  constructor(props){
    super(props);

    this.state =
    {
      loadedPosts: 5,
      hasMorePosts: true,
      posts : []
    }


    this.navBarType = this.navBarType.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.queryPosts = this.queryPosts.bind(this);

    this.halfDownPage = 0;
    this.first = true;
    this.scrollNumPosts = 5;
    this.loadingPosts = false;

    this.queryPosts();

  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  /*     functions to determine if user has scrolled to bottom and needs to laod more posts
  *///////////////////////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    window.addEventListener("scroll", this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleOnScroll);
  }

  isHalfWayDownPage(root) {
    if(this.first || this.scrollNumPosts!=this.state.loadedPosts)
    {
      this.halfDownPage = (document.getElementById('root').getBoundingClientRect().bottom + window.innerHeight) * .5;
      this.first = false;
      this.scrollNumPosts = this.state.loadedPosts;
    }

    if(this.loadingPosts === true)
        return false;

    return root.getBoundingClientRect().bottom <= this.halfDownPage;
  }

  handleOnScroll = () => {
    const wrappedElement = document.getElementById('root');
    if (this.isHalfWayDownPage(wrappedElement)) {
      this.loadingPosts = true;
      this.loadMorePosts();
    }
  };

  loadMorePosts()
  {
    //if there are more posts to be loaded
    if(this.state.hasMorePosts)
    {
      this.queryPosts();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////

  queryPosts() {

    //bind this to the function
    postsQuery = postsQuery.bind(this);

    postsQuery();
    async function postsQuery() {
      try{

        if(false === this.state.hasMorePosts)
            return;

        var queryPostsVariables={
          input: {
            "index": (this.state.loadedPosts - 5).toString(),
            "userId": this.props.match.params.userId
          }
        };


        //calls database query
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(queryPostsVariables)

        let queryPostsResponse = await fetch({
          query:
          `
          query userPosts($input: userPostsInput!){
            PostsAndHasNext: userPosts(input: $input){
              posts{
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
            hasNext
            }
          }
          `,
          variables: queryPostsVariables
        });


        //add the new posts to the posts array
        let posts = this.state.posts;
        posts = posts.concat( queryPostsResponse.data.PostsAndHasNext.posts);

        this.setState({posts: posts});
        this.setState({hasMorePosts: queryPostsResponse.data.PostsAndHasNext.hasNext});
        this.setState({loadedPosts: this.state.loadedPosts + 5});
        this.loadingPosts = false;


      } catch(err) {
        console.log(err);
      }

      }
  }

  navBarType() {
    return (this===undefined || this.context===undefined || this.context.user_name===undefined)
              ? "navBarWithSignIn" : "navBarWithoutSignIn";
  }

  render(){
    let navBar;
    if(this.navBarType()==="navBarWithSignIn")
        navBar = <NavBarWithSignIn key="navBarWithSignIn" />
    else
        navBar = <NavBarWithoutSignIn key="navBarWithoutSignIn" />

    return(
    <div key="feed" id="feed">
      {navBar}
      <div>
        {this.state.posts.map(postInfo => (
          <div key={postInfo.id}>
            <PostBox postInfo={postInfo}/>
            <p></p>
          </div>
        ))}
      </div>
      <Footer id="footer"/>
    </div>
    );
  }
};

Feed.contextType = UserContext;

export default Feed;
