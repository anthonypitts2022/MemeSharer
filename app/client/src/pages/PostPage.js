import React, { Component } from 'react';
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import UserContext from '../contexts/UserContext.js';
import Footer from "../components/Footer.jsx";
import PostBox from '../components/postBox.jsx';
const { createApolloFetch } = require('apollo-fetch');



class PostPage extends Component {

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
    if(this.first || this.scrollNumPosts!==this.state.loadedPosts)
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

    async function postsQuery() {
      try{

        if(false === this.state.hasMorePosts)
            return;

        var queryPostsVariables={
          id: window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
        };


        //calls database query
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(queryPostsVariables)

        let queryPostsResponse = await fetch({
          query:
          `
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
          `,
          variables: queryPostsVariables
        });


        //add the new posts to the posts array
        let posts = this.state.posts;
        posts = [queryPostsResponse.data.Post];

        this.setState({posts: posts});
        this.setState({hasMorePosts: false});
        this.setState({loadedPosts: this.state.loadedPosts + 5});
        this.loadingPosts = false;


      } catch(err) {
        //console.log(err);
      }

      }
      //bind this to the function
      var boundPostsQuery = postsQuery.bind(this);
      boundPostsQuery();
  }

  navBarType() {
    return ( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined )
              ? "navBarWithSignIn" : "navBarWithoutSignIn";
  }

  render(){
    let navBar;
    if(this.navBarType()==="navBarWithSignIn")
        navBar = <NavBarWithSignIn key="navBarWithSignIn" />
    else
        navBar = <NavBarWithoutSignIn key="navBarWithoutSignIn" />

    return(
    <div key="feed" id="feed" data-spy="scroll">

      <nav className="sticky-top" style={{backgroundColor: '#e0e0eb', paddingTop:"5px"}}>
        <div className="d-flex justify-content-center" >
          {navBar}
        </div>
      </nav>


          <p></p>
          <div>
            {this.state.posts.map(postInfo => (
              <div key={"posts" + postInfo.id}>
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

PostPage.contextType = UserContext;

export default PostPage;
