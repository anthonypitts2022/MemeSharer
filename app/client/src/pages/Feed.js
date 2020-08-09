import React, { Component } from 'react';
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import UserContext from '../contexts/UserContext.js';
import Footer from "../components/Footer.jsx";
import PostBox from '../components/postBox/postBox.jsx';

//MemeSharer API
const { globalPosts } = require('../APIFetches/globalPosts')
const { feedPosts } = require('../APIFetches/feedPosts')
const { refreshAccessToken } = require('../APIFetches/refreshAccessToken')

const { hasInvalidAccessToken } = require('../lib/hasInvalidAccessToken')


class Feed extends Component {

  constructor(props){
    super(props);

    this.state =
    {
      // ---------    Global Page variables ----------------//
      globalLoadedPosts: 5,
      globalHasMorePosts: true,
      globalPosts : [],

      // ---------    Following Page variables ----------------//
      followingLoadedPosts: 5,
      followingHasMorePosts: true,
      followingPosts : []

    }

    this.navBarType = this.navBarType.bind(this);
    this.scrollToFollowing = this.scrollToFollowing.bind(this);
    this.scrollToGlobal = this.scrollToGlobal.bind(this);

    this.onGlobalTab = true;

    // ---------    Global Page variables/functions ----------------//
    this.globalLoadMorePosts = this.globalLoadMorePosts.bind(this);
    this.globalQueryPosts = this.globalQueryPosts.bind(this);

    this.globalHalfDownPage = 0;
    this.globalFirst = true;
    this.globalScrollNumPosts = 5;
    this.globalLoadingPosts = false;
    this.globalScrollPosition = 0;

    // ---------    Following Page variables/functions ----------------//
    this.followingLoadMorePosts = this.followingLoadMorePosts.bind(this);
    this.followingQueryPosts = this.followingQueryPosts.bind(this);

    this.followingHalfDownPage = 0;
    this.followingFirst = true;
    this.followingScrollNumPosts = 5;
    this.followingLoadingPosts = false;
    this.followingScrollPosition = 0;


    this.globalQueryPosts();
    this.followingQueryPosts();

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
    if(this.globalFirst || this.globalScrollNumPosts !== this.state.globalLoadedPosts)
    {
      this.globalHalfDownPage = (document.getElementById('root').getBoundingClientRect().bottom + window.innerHeight) * .5;
      this.globalFirst = false;
      this.globalScrollNumPosts = this.state.globalLoadedPosts;
    }

    if(this.globalLoadingPosts)
        return false;

    return root.getBoundingClientRect().bottom <= this.globalHalfDownPage;
  }

  handleOnScroll = () => {
    const wrappedElement = document.getElementById('root');
    if (this.isHalfWayDownPage(wrappedElement)) {
      this.globalLoadingPosts = true;
      this.globalLoadMorePosts();
    }
  };

  globalLoadMorePosts()
  {
    //if there are more posts to be loaded
    if(this.state.globalHasMorePosts)
      this.globalQueryPosts();
  }

  followingLoadMorePosts()
  {
    //if there are more posts to be loaded
    if(this.state.followingHasMorePosts)
      this.followingQueryPosts();
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////

  globalQueryPosts() {

    async function postsQuery() {
      try{

        if(!this.state.globalHasMorePosts)
            return;
          
        var queryPostsResponse = await globalPosts(
          (this.state.globalLoadedPosts - 5).toString()
        )
        

        //add the new posts to the posts array
        let posts = this.state.globalPosts;
        posts = posts.concat( queryPostsResponse.data.PostsAndHasNext.posts);

        this.setState({globalPosts: posts});
        this.setState({globalHasMorePosts: queryPostsResponse.data.PostsAndHasNext.hasNext});
        this.setState({globalLoadedPosts: this.state.globalLoadedPosts + 5});
        this.globalLoadingPosts = false;

      } catch(err) {
        console.log(err);
      }

      }

      //bind this to the function
      let boundedPostsQuery = postsQuery.bind(this);

      boundedPostsQuery();
  }

  followingQueryPosts() {
    //if user is not signed in
    if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id )
      return;

    async function postsQuery() {
      try{
        if(!this.state.followingHasMorePosts)
          return;

        var queryPostsResponse = await feedPosts(
          (this.state.followingLoadedPosts - 5).toString(),
          JSON.parse(localStorage.getItem('user')).id
        )

        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(queryPostsResponse)){
          if(await refreshAccessToken())
            this.followingQueryPosts()
          return
        }

        //add the new posts to the posts array
        let posts = this.state.followingPosts;
        posts = posts.concat( queryPostsResponse.data.PostsAndHasNext.posts);

        this.setState({followingPosts: posts});
        this.setState({followingHasMorePosts: queryPostsResponse.data.PostsAndHasNext.hasNext});
        this.setState({followingLoadedPosts: this.state.followingLoadedPosts + 5});
        this.followingLoadingPosts = false;


      } catch(err) {
        console.log(err);
      }

      }

      //bind this to the function
      let boundedPostsQuery = postsQuery.bind(this);

      boundedPostsQuery();
  }

  navBarType() {
    return ( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id )
              ? "navBarWithSignIn" : "navBarWithoutSignIn";
  }

  scrollToGlobal(){
    if(this.onGlobalTab)
    {
      //scroll to top
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      //set global position to 0
      this.globalScrollPosition = 0;
    }
    else
    {
      //save the following position
      this.followingScrollPosition = document.body.scrollTop;
      //scroll to global position
      document.body.scrollTop = this.globalScrollPosition; // For Safari
      document.documentElement.scrollTop = this.globalScrollPosition; // For Chrome, Firefox, IE and Opera
      //set the current tab to be global
      this.onGlobalTab = true;
    }
  }


  scrollToFollowing(){
    if(!this.onGlobalTab)
    {
      //scroll to top
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      //set following position to 0
      this.followingScrollPosition = 0;
    }
    else
    {
      //save the global position
      this.globalScrollPosition = document.body.scrollTop;
      //scroll to following position
      document.body.scrollTop = this.followingScrollPosition; // For Safari
      document.documentElement.scrollTop = this.followingScrollPosition; // For Chrome, Firefox, IE and Opera
      //set the current tab to be following
      this.onGlobalTab = false;
    }
  }



  render(){

    let navBar;
    if(this.navBarType()==="navBarWithSignIn")
        navBar = <NavBarWithSignIn key="navBarWithSignIn" id="navFeed"/>
    else
        navBar = <NavBarWithoutSignIn key="navBarWithoutSignIn" id="navFeed"/>

    return(
    <div key="feed" id="feed" data-spy="scroll">


      <nav className="sticky-top" style={{backgroundColor: '#e0e0eb', paddingTop:"5px"}}>
        <div className="d-flex justify-content-center" >
          {navBar}
        </div>
        <div className="d-flex justify-content-center">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="global-tab" data-toggle="tab" href="#global" onClick={this.scrollToGlobal} role="tab" aria-controls="global" aria-selected="true">Global</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="following-tab" data-toggle="tab" href="#following" onClick={this.scrollToFollowing} role="tab" aria-controls="following" aria-selected="false">Following</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="global" role="tabpanel" aria-labelledby="global-tab">
          <p></p>
          <div className="container">
            <div className="row">


              <div className="col-12">
                {this.state.globalPosts.map(postInfo => postInfo ? (
                  <div key={"global" + postInfo.id}>
                    <PostBox postInfo={postInfo}/>
                    <p></p>
                  </div>
                ) : "")}
              </div>



            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="following" role="tabpanel" aria-labelledby="following-tab">
          <p></p>
          <div>
            {this.state.followingPosts.map(postInfo => postInfo ? (
              <div key={"following" + postInfo.id}>
                <PostBox postInfo={postInfo}/>
                <p></p>
              </div>
            ): "")}
          </div>
        </div>
      </div>

      <Footer id="footer"/>
    </div>
    );
  }
};

Feed.contextType = UserContext;

export default Feed;
