import React, { Component } from 'react';
import NavBarWithSignIn from '../components/navBarWithSignIn.jsx';
import NavBarWithoutSignIn from '../components/navBarWithoutSignIn.jsx';
import UserContext from '../contexts/UserContext.js';
import Footer from "../components/Footer.jsx";
import PostBox from '../components/postBox/postBox.jsx';

//MemeSharer API
const { userPosts } = require('../APIFetches/userPosts.js')
const { refreshAccessToken } = require('../APIFetches/refreshAccessToken')

const { hasInvalidAccessToken } = require('../lib/hasInvalidAccessToken')



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
    if(this.first || this.scrollNumPosts!==this.state.loadedPosts)
    {
      this.halfDownPage = (document.getElementById('root').getBoundingClientRect().bottom + window.innerHeight) * .5;
      this.first = false;
      this.scrollNumPosts = this.state.loadedPosts;
    }

    if(this.loadingPosts)
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
      this.queryPosts()
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////

  queryPosts() {

    async function postsQuery() {
      try{

        if(!this.state.hasMorePosts)
          return;

        var queryPostsResponse = await userPosts(
          (this.state.loadedPosts - 5).toString(),
          this.props.match.params.userId
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(queryPostsResponse)){
          if(await refreshAccessToken())
            this.queryPosts()
          return
        }

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
    <div key="PostPage" id="feed" data-spy="scroll">

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

Feed.contextType = UserContext;

export default Feed;
