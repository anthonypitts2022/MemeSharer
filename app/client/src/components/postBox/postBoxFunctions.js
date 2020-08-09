import $ from "jquery"

//MemeSharer API
const { likedStatus } = require('../../APIFetches/likedStatus')
const { createComment } = require('../../APIFetches/createComment')
const { createLike } = require('../../APIFetches/createLike')
const { postLikeStatus } = require('../../APIFetches/postLikeStatus')
const { deletePost } = require('../../APIFetches/deletePost')
const { editCaption } = require('../../APIFetches/editCaption')
const { isFollowing } = require('../../APIFetches/isFollowing')
const { followUser } = require('../../APIFetches/followUser')
const { unfollowUser } = require('../../APIFetches/unfollowUser')
const { refreshAccessToken } = require('../../APIFetches/refreshAccessToken')

const { hasInvalidAccessToken } = require('../../lib/hasInvalidAccessToken')

export class PostBoxFunctions {

  constructor(component) {
    this.component = component;

    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleDislikeClick = this.handleDislikeClick.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleAddCaptionChange = this.handleAddCaptionChange.bind(this);
    this.handleEditCaption = this.handleEditCaption.bind(this);
    this.handleCopyLink = this.handleCopyLink.bind(this);
    this.loadMoreComments = this.loadMoreComments.bind(this);
    this.followingStatus = this.followingStatus.bind(this);
    this.followUserOfPost = this.followUserOfPost.bind(this);
    this.unfollowUserOfPost = this.unfollowUserOfPost.bind(this);
    this.setupOnClicks = this.setupOnClicks.bind(this);
    this.checkLikeStatus = this.checkLikeStatus.bind(this);
    this.handleAddCommentChange = this.handleAddCommentChange.bind(this);

  }

  checkLikeStatus(){
    //change the color of the thumbs up/thumbs down buttons
    async function getLike() {
      try{

        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id  )
          return

        var response = await likedStatus(
          this.component.state.postId, 
          JSON.parse(localStorage.getItem('user')).id
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(response)){
          if(await refreshAccessToken())
            this.component.checkLikeStatus()
          return
        }

        var like = response && response.data && response.data.Like;
        //if the current user hasn't liked or disliked the post or an error returned
        if( !like || response.errors)
          return;

        //if current user liked this.component post
        if(like.isLike){
          $(`.thumbsUp${this.component.state.componentID}`).css("color", "#00BFFF")
        }
        //if current user disliked this.component post
        else{
          $(`.thumbsDown${this.component.state.componentID}`).css("color", "red")
        }

      }
      catch(err) {
        console.log(err);
      }
    }

    //bind this.component to the getLike function
    let boundedGetLike = getLike.bind(this);

    boundedGetLike();
  }

  handleAddCaptionChange(event) {
    if(event.target.value !== ""){
      this.component.setState({newCaption: event.target.value});
    }
    else{
      this.component.setState({newCaption: null});
    }
  }

  handleAddComment() {

    async function addComment() {
      try{

        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id )
          window.location = "/login";
        
        var createCommentResponse = await createComment(
          this.component.state.addCommentText, 
          this.component.state.postId, 
          JSON.parse(localStorage.getItem('user')).id
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(createCommentResponse)){
          if(await refreshAccessToken())
            this.component.handleAddComment()
          return
        }

        //if invalid comment
        if(createCommentResponse.errors)
          return;

        //add the new comment to the comment array
        let comments = this.component.state.comments;
        comments[comments.length] = createCommentResponse.data.Comment;

        this.component.setState({comments: comments});
        this.component.setState({addCommentText: ''});

        //clear input to add comment
        var element = document.getElementsByClassName("commentInput"+this.component.state.componentID);
        for(var i = 0; i < element.length; i++) {
          element[i].value = '';
        }

      } catch(err) {
        console.log(err);
      }

      }

      //bind this.component to the addLike function
      let boundedAddComment = addComment.bind(this);

      boundedAddComment();
  }

  handleLikeClick(event) {


    async function addLike() {
      try{

        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id  ){
          window.location = "/login";
        }

        var createLikeResponse = await createLike(
          true, 
          this.component.state.postId, 
          JSON.parse(localStorage.getItem('user')).id
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(createLikeResponse)){
          if(await refreshAccessToken())
            this.component.handleLikeClick()
          return
        }

        if(createLikeResponse.errors)
          return;
        $(`.thumbsUp${this.component.state.componentID}`).css("color", "#00BFFF")
        $(`.thumbsDown${this.component.state.componentID}`).css("color", "")

        var queryPostResponse = await postLikeStatus(this.component.state.postId)

        if(queryPostResponse.errors)
          return;

        var newLikeCount = queryPostResponse.data.Post.likeCount;
        var newDislikeCount = queryPostResponse.data.Post.dislikeCount;

        //reset the new like / dislike counts from most recent query
        this.component.setState({likeCount: newLikeCount});
        this.component.setState({dislikeCount: newDislikeCount});

      }
      catch(err) {
        console.log(err);
      }
    }

    //bind this.component to the addLike function
    let boundedAddLike = addLike.bind(this);

    boundedAddLike();
  }

  handleDislikeClick(event) {


    async function addDislike() {
      try{

        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id ){
          window.location = "/login";
        }

        var createLikeResponse = await createLike(
          false,
          this.component.state.postId,
          JSON.parse(localStorage.getItem('user')).id
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(createLikeResponse)){
          if(await refreshAccessToken())
            this.component.handleDislikeClick()
          return
        }

        if(createLikeResponse.errors)
          return;
        $(`.thumbsUp${this.component.state.componentID}`).css("color", "")
        $(`.thumbsDown${this.component.state.componentID}`).css("color", "red")

        // ------    retrieve new like count ------//
        var queryPostResponse = await postLikeStatus(this.component.state.postId)

        if(queryPostResponse.errors)
          return;

        var newLikeCount = queryPostResponse.data.Post.likeCount;
        var newDislikeCount = queryPostResponse.data.Post.dislikeCount;

        //reset the new like / dislike counts from most recent query
        this.component.setState({likeCount: newLikeCount});
        this.component.setState({dislikeCount: newDislikeCount});

      }
      catch(err) {
        console.log(err);
      }
    }

    //bind this.component to the addDislike function
    let boundedAddDislike = addDislike.bind(this);

    boundedAddDislike();
  }

  handleDeletePost(event) {

    async function removePost() {
      try{
        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id )
          window.location = "/login"
        
        if(JSON.parse(localStorage.getItem('user')).email !== this.component.state.userEmail)
          return null

        var response = await deletePost(this.component.state.postId)
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(response)){
          if(await refreshAccessToken())
            this.component.handleDeletePost()
          return
        }

        this.component.setState({deleted: true});

      }
      catch(err) {
        console.log(err);
      }
    }

    //bind this.component to the removePost function
    let boundedRemovePost = removePost.bind(this);

    boundedRemovePost();
  }

  handleEditCaption(event) {


    async function updateCaption() {
      try{



        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id ){
          window.location = "/login";
        }
        if(JSON.parse(localStorage.getItem('user')).email !== this.component.state.userEmail)
        {
          document.getElementById(this.component.state.componentID + "newCaptionInput").value = ''
          return;
        }
        if(!this.component.state.newCaption)
        {
          document.getElementById(this.component.state.componentID + "newCaptionInput").value = ''
          return;
        }

        var editCaptionResponse = await editCaption(this.component.state.postId, this.component.state.newCaption)
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(editCaptionResponse)){
          if(await refreshAccessToken())
            this.component.handleEditCaption()
          return
        }

        if(editCaptionResponse.errors){
          document.getElementById(this.component.state.componentID + "newCaptionInput").value = ''
          return;
        }

        document.getElementById(this.component.state.componentID + "newCaptionInput").value = ''
        this.component.setState({caption: editCaptionResponse.data.Post.caption});
        this.component.setState({newCaption: null});



      }
      catch(err) {
        console.log(err);
      }
    }

    //bind this.component to the function
    let boundedUpdateCaption = updateCaption.bind(this);

    boundedUpdateCaption();
  }

  handleCopyLink(event) {


    async function copyLink() {
      try{
        let link = ""
        //if in local host dev
        if(process.env.REACT_APP_NODE_ENV==="development"){
          link = window.location.hostname + ":" + window.location.port + "/post/" + this.component.state.postId;
        }
        //if in production
        else{
          link = process.env.REACT_APP_website_name + "/post/" + this.component.state.postId;
        }

        //copy post link to clipboard
        navigator.clipboard.writeText(link);

      }
      catch(err) {
        console.log(err);
      }
    }

    //bind this.component to the copyLink function
    let boundedCopyLink = copyLink.bind(this);

    boundedCopyLink();
  }

  loadMoreComments(event) {
    this.component.setState({visibleComments: this.component.state.visibleComments + 3});
  }

  followingStatus(){

    //if user is not signed in
    if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id )
      return false


    async function getFollowingButton() {
      try{

        var response = await isFollowing(
          JSON.parse(localStorage.getItem('user')).id,
          this.component.state.userId
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(response)){
          if(await refreshAccessToken())
            this.component.followingStatus()
          return
        }

        // if the current user is already following the user of this.component post
        if(response && response.data && response.data.isFollowing)
          return true
        else 
          return false;

      } catch(err) {
        console.log(err);
      }

      }

      //bind this.component to the addLike function
      let boundedGetFollowingButton = getFollowingButton.bind(this);

      return boundedGetFollowingButton();
  }

  followUserOfPost(){


    async function follow() {
      try{

        //if user is not signed in
        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id )
          window.location = "/login"

        var response = await followUser(
          JSON.parse(localStorage.getItem('user')).id,
          this.component.state.userId
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(response)){
          if(await refreshAccessToken())
            this.component.followUserOfPost()
          return
        }

        if(response.data.Followship){
          this.component.setState({followingUserOfPost: true});
        }

      } catch(err) {
        console.log(err);
      }

      }

      //bind this.component to the follow function
      let boundedFollow = follow.bind(this);

      boundedFollow();
  }

  unfollowUserOfPost(){

    async function unfollow() {
      try{

        //if user is not signed in
        if( !localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user')).id )
          window.location = "/login"

        var response = await unfollowUser(
          JSON.parse(localStorage.getItem('user')).id,
          this.component.state.userId
        )
        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(response)){
          if(await refreshAccessToken())
            this.component.unfollowUserOfPost()
          return
        }

        if(response.data.deleteFollowship){
          this.component.setState({followingUserOfPost: false});
        }

      } catch(err) {
        console.log(err);
      }

      }

      //bind this.component to the unfollow function
      let boundedUnfollow = unfollow.bind(this);

      boundedUnfollow();
  }

  handleAddCommentChange(event) {
    this.component.setState({addCommentText: event.target.value});
  }


  setupOnClicks(){

    let postBoxFunctions = this.component.postBoxFunctions
    let componentID = this.component.state.componentID

    // handle submitting an edited caption
    $(`.editCaptionSubmit${componentID}`).on('click touchstart', function(){
      postBoxFunctions.handleEditCaption()
    })

    //handle clicking load more comments button
    $(`.loadMoreCommentsBtn${componentID}`).on('click touchstart', function(){
      postBoxFunctions.loadMoreComments()
    })

    //handle submitting a comment and adding characters to comment
    $(`.commentInput${componentID}`).keypress(function(event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode === 13)
        postBoxFunctions.handleAddComment()
    });

    
    //if user is signed in
    if( localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).id )
    {
      if (JSON.parse(localStorage.getItem('user')).id !== this.component.state.userId){

        $(`.followBtnArea${componentID}`).on('click touchstart', function(){
          if(this.component.state.followingUserOfPost){
            this.unfollowUserOfPost()
          }
          else{
            this.followUserOfPost()
          }
        }.bind(this))

      }
    }

  }

}

