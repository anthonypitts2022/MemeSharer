import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';
import { Image } from 'react-native';
import { Icon } from '@iconify/react';
import ellipsisH from '@iconify/icons-fa/ellipsis-h';
import userIcon from '@iconify/icons-simple-line-icons/user';
import userFollowing from '@iconify/icons-simple-line-icons/user-following';
import thumbsUp from '@iconify/icons-dashicons/thumbs-up';
import thumbsDown from '@iconify/icons-dashicons/thumbs-down';
import $ from "jquery"

const { createApolloFetch } = require('apollo-fetch');



class PostBox extends Component {

  constructor(props){
    super(props);

    this.state = {
      fileId: (typeof props.postInfo.fileId === 'undefined') ? "" : props.postInfo.fileId,
      fileType: (typeof props.postInfo.fileType === 'undefined') ? "" : props.postInfo.fileType,
      likeCount: (typeof props.postInfo.likeCount === 'undefined') ? 0: props.postInfo.likeCount,
      dislikeCount: (typeof props.postInfo.dislikeCount === 'undefined') ? 0: props.postInfo.dislikeCount,
      caption: (typeof props.postInfo.caption === 'undefined') ? "" : props.postInfo.caption,
      postId: (typeof props.postInfo.id === 'undefined') ? "" : props.postInfo.id,
      userEmail: (typeof props.postInfo.user.email === 'undefined') ? "" : props.postInfo.user.email,
      profileUrl: (typeof props.postInfo.user.profileUrl === 'undefined') ? "" : props.postInfo.user.profileUrl,
      username: (typeof props.postInfo.user.name === 'undefined') ? "" : props.postInfo.user.name,
      userId: (typeof props.postInfo.user.id === 'undefined') ? "" : props.postInfo.user.id,
      comments: (typeof props.postInfo.comments === 'undefined') ? [] : props.postInfo.comments,
      addCommentText: '',
      newCaption: null,
      visibleComments: 3,
      deleted: false,
      followingUserOfPost: null
    };


    this.handleAddCommentChange = this.handleAddCommentChange.bind(this);
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


  }


  componentDidMount(){

    async function getFollowingStatus() {
      this.setState({followingUserOfPost: await this.followingStatus()})
    }
    //bind this to the function
    var boundGetFollowingStatus = getFollowingStatus.bind(this);
    boundGetFollowingStatus();

    this.checkLikeStatus()

    this.setupOnClicks()

  }

  checkLikeStatus(){
    //change the color of the thumbs up/thumbs down buttons
    async function getLike() {
      try{

        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined  ){
          return
        }

        var getLikedVariables={"input": { "postId": this.state.postId, "userId": JSON.parse(localStorage.getItem('user')).id } };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(getLikedVariables)

        let response = await fetch({
          query:
          `
          query liked($input: likedInput!){
            Like: liked(input: $input){
              errors{
                msg
              }
              isLike
            }
          }
          `,
          variables: getLikedVariables
        })

        var like = response.data.Like;
        //if the current user hasn't liked or disliked the post or an error returned
        if(like === null || like.errors!=null)
          return;

        //if current user liked this post
        if(like.isLike){
          $(`.thumbsUp${this.state.postId}`).css("color", "#00BFFF")
        }
        //if current user disliked this post
        else{
          $(`.thumbsDown${this.state.postId}`).css("color", "red")
        }

      }
      catch(err) {
        console.log(err);
      }
    }

    //bind this to the getLike function
    let boundedGetLike = getLike.bind(this);

    boundedGetLike();
  }

  handleAddCommentChange(event) {
    this.setState({addCommentText: event.target.value});
  }

  handleAddCaptionChange(event) {
    if(event.target.value !== ""){
      this.setState({newCaption: event.target.value});
    }
    else{
      this.setState({newCaption: null});
    }
  }

  handleAddComment(event) {

    async function addComment() {
      try{

        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined ){
          window.location = "/login";
        }

        var createCommentVariables={
          "input": {
            "text": this.state.addCommentText,
            "postId": this.state.postId,
            "userId": JSON.parse(localStorage.getItem('user')).id
          }
        };


        //calls create comment database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(createCommentVariables)

        let createCommentResponse = await fetch({
          query:
          `
          mutation createComment($input: createCommentInput){
            Comment: createComment(input: $input){
              errors{
                msg
              }
              id
              userId
              user{
                name
              }
              postId
              text
            }
          }
          `,
          variables: createCommentVariables
        })


       //if invalid comment
       if(createCommentResponse.data.Comment.errors != null)
         return;

        //add the new comment to the comment array
        let comments = this.state.comments;
        comments[comments.length] = createCommentResponse.data.Comment;

        this.setState({comments: comments});
        this.setState({addCommentText: ''});

        //clear input to add comment
        document.getElementById("commentInput"+this.state.postId).value = '';

      } catch(err) {
        //console.log(err);
      }

      }

      //bind this to the addLike function
      let boundedAddComment = addComment.bind(this);

      boundedAddComment();
  }

  handleLikeClick(event) {


    async function addLike() {
      try{

        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined  ){
          window.location = "/login";
        }

        var createLikeVariables={"input": { "isLike":true, "postId": this.state.postId, "userId": JSON.parse(localStorage.getItem('user')).id } };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(createLikeVariables)

        let createLikeResponse = await fetch({
          query:
          `
          mutation createLike($input: createLikeInput){
            Like: createLike(input: $input){
              errors{
                msg
              }
            }
          }
          `,
          variables: createLikeVariables
        })

        //newLike holds the data of the newly created like
        var newLike = createLikeResponse.data.Like;
        if(newLike.errors != null)
          return;
        $(`.thumbsUp${this.state.postId}`).css("color", "#00BFFF")
        $(`.thumbsDown${this.state.postId}`).css("color", "")


        // ------    retrieve new like count ------//
        var queryPostVariables={"id": this.state.postId };

        fetch = fetch.bind(queryPostVariables);

        let queryPostResponse = await fetch({
          query:
          `
          query getAPost($id: String!){
            Post: getAPost(id: $id){
              errors{
                msg
              }
              likeCount
              dislikeCount
            }
          }
          `,
          variables: queryPostVariables
        })

        if(queryPostResponse.data.Post.errors != null)
          return;

        var newLikeCount = queryPostResponse.data.Post.likeCount;
        var newDislikeCount = queryPostResponse.data.Post.dislikeCount;

        //reset the new like / dislike counts from most recent query
        this.setState({likeCount: newLikeCount});
        this.setState({dislikeCount: newDislikeCount});

      }
      catch(err) {
        //console.log(err);
      }
    }

    //bind this to the addLike function
    let boundedAddLike = addLike.bind(this);

    boundedAddLike();
  }

  handleDislikeClick(event) {


    async function addLike() {
      try{

        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined ){
          window.location = "/login";
        }

        var createLikeVariables={"input": { "isLike":false, "postId": this.state.postId, "userId": JSON.parse(localStorage.getItem('user')).id } };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(createLikeVariables)

        let createLikeResponse = await fetch({
          query:
          `
          mutation createLike($input: createLikeInput){
            Like: createLike(input: $input){
              errors{
                msg
              }
            }
          }
          `,
          variables: createLikeVariables
        })

        //newLike holds the data of the newly created like
        var newLike = createLikeResponse.data.Like;
        if(newLike.errors != null)
          return;
        $(`.thumbsUp${this.state.postId}`).css("color", "")
        $(`.thumbsDown${this.state.postId}`).css("color", "red")

        // ------    retrieve new like count ------//
        var queryPostVariables={"id": this.state.postId };

        fetch = fetch.bind(queryPostVariables);

        let queryPostResponse = await fetch({
          query:
          `
          query getAPost($id: String!){
            Post: getAPost(id: $id){
              errors{
                msg
              }
              likeCount
              dislikeCount
            }
          }
          `,
          variables: queryPostVariables
        })

        if(queryPostResponse.data.Post.errors != null)
          return;

        var newLikeCount = queryPostResponse.data.Post.likeCount;
        var newDislikeCount = queryPostResponse.data.Post.dislikeCount;

        //reset the new like / dislike counts from most recent query
        this.setState({likeCount: newLikeCount});
        this.setState({dislikeCount: newDislikeCount});

      }
      catch(err) {
        //console.log(err);
      }
    }

    //bind this to the addLike function
    let boundedAddLike = addLike.bind(this);

    boundedAddLike();
  }

  handleDeletePost(event) {


    async function deletePost() {
      try{
        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined ){
          window.location = "/login";
        }
        if(JSON.parse(localStorage.getItem('user')).email !== this.state.userEmail)
        {
          return null;
        }

        var deletePostVariables={"id": this.state.postId };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(deletePostVariables)

        await fetch({
          query:
          `
          mutation deletePost($id: String!){
            deletePost(id: $id)
          }
          `,
          variables: deletePostVariables
        })

        this.setState({deleted: true});

      }
      catch(err) {
        //console.log(err);
      }
    }

    //bind this to the deletePost function
    let boundedDeletePost = deletePost.bind(this);

    boundedDeletePost();
  }

  handleEditCaption(event) {


    async function editCaption() {
      try{



        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined ){
          window.location = "/login";
        }
        if(JSON.parse(localStorage.getItem('user')).email !== this.state.userEmail)
        {
          document.getElementById(this.state.postId + "newCaptionInput").value = ''
          return;
        }
        if(this.state.newCaption === null)
        {
          document.getElementById(this.state.postId + "newCaptionInput").value = ''
          return;
        }

        var editCaptionVariables={
          "input": {
            "postId": this.state.postId,
            "newCaption": this.state.newCaption
          }
        };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(editCaptionVariables)

        let editCaptionResponse = await fetch({
          query:
          `
          mutation editCaption($input: editCaptionInput!){
            Post: editCaption(input: $input){
              errors{
                msg
              }
              caption
            }
          }
          `,
          variables: editCaptionVariables
        })

        if(editCaptionResponse.errors != null)
        {
          document.getElementById(this.state.postId + "newCaptionInput").value = ''
          return;
        }

        document.getElementById(this.state.postId + "newCaptionInput").value = ''
        this.setState({caption: editCaptionResponse.data.Post.caption});
        this.setState({newCaption: null});



      }
      catch(err) {
        //console.log(err);
      }
    }

    //bind this to the function
    let boundedEditCaption = editCaption.bind(this);

    boundedEditCaption();
  }

  handleCopyLink(event) {


    async function copyLink() {
      try{
        let link = ""
        //if in local host dev
        if(process.env.REACT_APP_NODE_ENV==="development"){
          link = window.location.hostname + ":" + window.location.port + "/post/" + this.state.postId;
        }
        //if in production
        else{
          link = process.env.REACT_APP_website_name + "/post/" + this.state.postId;
        }

        //copy post link to clipboard
        navigator.clipboard.writeText(link);

      }
      catch(err) {
        //console.log(err);
      }
    }

    //bind this to the copyLink function
    let boundedCopyLink = copyLink.bind(this);

    boundedCopyLink();
  }

  loadMoreComments(event) {
    this.setState({visibleComments: this.state.visibleComments + 3});
  }

  followingStatus(){

    //if user is not signed in
    if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined )
    {
      return false;
    }


    async function getFollowingButton() {
      try{

        var isFollowingVariables={
          "input": {
            "followerId": JSON.parse(localStorage.getItem('user')).id,
            "followeeId": this.state.userId
          }
        };


        //calls create comment database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(isFollowingVariables)

        let response = await fetch({
          query:
          `
          query isFollowing($input: followshipInput!){
            isFollowing(input: $input)
          }
          `,
          variables: isFollowingVariables
        })

        // if the current user is already following the user of this post
        if(response){
          if(response.data.isFollowing){
            return true;
          }
          return false;
        } else {
          return false;
        }

      } catch(err) {
        //console.log(err);
      }

      }

      //bind this to the addLike function
      let boundedGetFollowingButton = getFollowingButton.bind(this);

      return boundedGetFollowingButton();
  }

  followUserOfPost(){


    async function follow() {
      try{
        //if user is not signed in
        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined )
        {
          window.location = "/login"
        }

        var createFollowshipVariables={
          "input": {
            "followerId": JSON.parse(localStorage.getItem('user')).id,
            "followeeId": this.state.userId
          }
        };


        //calls database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(createFollowshipVariables)

        let response = await fetch({
          query:
          `
          mutation createFollowship($input: followshipInput!){
            Followship: createFollowship(input: $input){
              followerId
            }
          }
          `,
          variables: createFollowshipVariables
        })

        if(response.data.Followship != null){
          this.setState({followingUserOfPost: true});
        }

      } catch(err) {
        //console.log(err);
      }

      }

      //bind this to the follow function
      let boundedFollow = follow.bind(this);

      boundedFollow();
  }

  unfollowUserOfPost(){

    async function unfollow() {
      try{

        //if user is not signed in
        if( localStorage.getItem('user')==null || JSON.parse(localStorage.getItem('user')).id===undefined )
        {
          window.location = "/login"
        }

        var deleteFollowshipVariables={
          "input": {
            "followerId": JSON.parse(localStorage.getItem('user')).id,
            "followeeId": this.state.userId
          }
        };


        //calls database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(deleteFollowshipVariables)

        let response = await fetch({
          query:
          `
          mutation deleteFollowship($input: followshipInput!){
            deleteFollowship(input: $input)
          }
          `,
          variables: deleteFollowshipVariables
        })

        if(response.data.deleteFollowship === true){
          this.setState({followingUserOfPost: false});
        }

      } catch(err) {
        //console.log(err);
      }

      }

      //bind this to the unfollow function
      let boundedUnfollow = unfollow.bind(this);

      boundedUnfollow();
  }

  setupOnClicks(){
    let postBoxMethods = this

    $("#editCaptionSubmit").on('click touchstart', function(){
      postBoxMethods.handleEditCaption()
    })

    $("#loadMoreCommentsBtn").on('click touchstart', function(){
      postBoxMethods.loadMoreComments()
    })

    //this doesnt work so there is a problem finding the following button

    $("#followingUserOfPostBtn").on('click touchstart', function(){
      postBoxMethods.unfollowUserOfPost()
    })

    $("#unfollowingUserOfPostBtn").on('click touchstart', function(){
      postBoxMethods.followUserOfPost()
    })



  }

  render(){

    //if post has been deleted
    if(this.state.deleted === true)
    return(
      <div className="row">
        <div className="col-md-6 offset-md-4">
          <div className="card" style={{width:"40rem"}}>
            <div className="card-body">
              <p className="text-center font-weight-bold"><font color="#ff1a1a">This Post Has Been Deleted</font></p>
            </div>
          </div>
        </div>
      </div>
    )

    // if there are more comments that can be displayed
    let loadMoreCommentsButton;
    if(this.state.comments.length > this.state.visibleComments){
      loadMoreCommentsButton = <button id="loadMoreCommentsBtn" type="button" className="btn btn-sm btn-success" style={{fontSize:'12px'}}>View More Comments</button>;
    }

    // if this post is not by the current user, then display a follow/followed button
    let followingUserOfPostButton;
    //if user is signed in
    if( localStorage.getItem('user')!=null && JSON.parse(localStorage.getItem('user')).id!==undefined )
    {
      if (JSON.parse(localStorage.getItem('user')).id !== this.state.userId && this.state.followingUserOfPost!=null){
        // if following
        if(this.state.followingUserOfPost){
          followingUserOfPostButton = <button className="btn btn-lg btn-secondary " type="button" id="followingUserOfPostBtn" style={{backgroundColor: 'Transparent', border:'none',  color:'black'}}><Icon icon={userFollowing} /></button>
        }
        // if not following
        else{
          followingUserOfPostButton = <button className="btn btn-lg btn-secondary " type="button" id="unfollowingUserOfPostBtn" style={{backgroundColor: 'Transparent', border:'none',  color:'black'}}><Icon icon={userIcon} /></button>
        }
      }
    }



    let postSettingsButtons;
    //if this is the signed in user's post (so they can delete it etc.)
    if(JSON.parse(localStorage.getItem('user'))!=null && JSON.parse(localStorage.getItem('user')).id === this.state.userId)
    {
      postSettingsButtons =
      <div>
        <button type="button" className="dropdown-item" data-toggle="modal" data-target={"#editCaptionModal"+this.state.postId} >Edit Caption</button>
        <button onClick={this.handleDeletePost} className="dropdown-item">Delete Post</button>
        <button onClick={this.handleCopyLink} className="dropdown-item">Copy Link</button>
      </div>
    }
    //if this is not the signed in user's post (so they can't delete it etc.)
    else{
      postSettingsButtons =
      <div>
        <button onClick={this.handleCopyLink} className="dropdown-item">Copy Link</button>
      </div>
    }


    return(
      <div className="container">

        <div className="modal fade" id={"editCaptionModal"+this.state.postId} tabIndex="-1" role="dialog" aria-labelledby="editCaptionModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{backgroundColor: '#e0e0eb'}} >
              <div className="modal-header">
                <h5 className="modal-title" id="editCaptionModalLabel">Change Caption</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul>
                  <font className="font-weight-bold">Current Caption</font>: {this.state.caption}
                </ul>
                <ul>
                  <font className="font-weight-bold">New Caption</font>: <label htmlFor="InputCaption"></label>
                  <input id={this.state.postId + "newCaptionInput"} type="Comment" className="form-control" onChange={this.handleAddCaptionChange} aria-describedby="CommentHelp" placeholder="Enter New Caption"></input>
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" id="editCaptionSubmit" data-dismiss="modal">Save changes</button>
              </div>
            </div>
          </div>
        </div>

          <div className="card" style={{backgroundColor: '#F0F8FF'}}>
            <div className="card-body" style={{paddingTop: '8px', paddingBottom:'5px'}}>
                <div className="row">

                <div className="col-9 ">
                  <a href={"/profile/"+this.state.userId} style={{textDecoration:"none", float:"left", marginRight:'3%'}}>
                    <Image
                      source={{uri: this.state.profileUrl}}
                      style={{width: 30, height: 30, borderRadius: 30/ 2}}
                    />
                  </a>

                  <a href={"/profile/"+this.state.userId} style={{textDecoration:"none", float:"left", fontSize:'15px', marginRight:'3%', display:'inline-block', height:'1em', verticalAlign:'bottom', paddingTop:'5px'}} color="006699">
                    {this.state.username}
                  </a>
                  {followingUserOfPostButton}
                </div>



                <div className="col-3">
                  <button className="btn btn-md btn-secondary " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{backgroundColor: 'Transparent', border:'none', float: "right"}}>
                    <Icon icon={ellipsisH} style={{color: "grey"}}/>
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {postSettingsButtons}
                  </div>
                </div>

              </div>
            </div>

            <div style={{position:"asbolute", zIndex:"1"}}>
              <img style={{position:"relative", zIndex:"2"}} alt="Post Img" className="card-img-top" src={`${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_postsms_port}/file/${this.state.fileId}/${this.state.fileType}`} ></img>
            </div>

            <div className="card-body" style={{paddingTop:'2px', paddingBottom:'10px'}}>

              <Icon style={{fontSize:'25px'}} onClick={this.handleLikeClick} icon={thumbsUp} className={"thumbsUp"+this.state.postId}/>&nbsp;
              <span style={{fontSize:'25px', fontWeight:'bold', display:'inline-block', height:'1.2em', verticalAlign:'bottom'}} >{this.state.likeCount}</span>&nbsp;&nbsp;

              <Icon style={{fontSize:'25px'}} onClick={this.handleDislikeClick} icon={thumbsDown} className={"thumbsDown"+this.state.postId}/>&nbsp;
              <span style={{fontSize:'25px', fontWeight:'bold', display:'inline-block', height:'1.2em', verticalAlign:'bottom'}} >{this.state.dislikeCount}</span>

              <h5 className="card-title" style={{fontSize:'18px', fontWeight:'bold'}}>{this.state.caption}</h5>

              <span>
                {this.state.comments.slice(0,this.state.visibleComments).map(comment => (
                  <div key={comment.id}>
                    <p key={comment.id+"user"} className="card-text">{comment.user.name + ": "}{comment.text}</p>
                  </div>
                ))}
              </span>
              <div>
                {loadMoreCommentsButton}
              </div>

              <div className="input-group mb-3" style={{paddingTop:'5px'}}>
                <input type="Comment" className="form-control" onChange={this.handleAddCommentChange} id={"commentInput"+this.state.postId} placeholder="Enter Comment"></input>
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" onClick={this.handleAddComment} type="button">Post</button>
                </div>
              </div>

            </div>
          </div>

      </div>
    );

  }
}

PostBox.contextType = UserContext;

export default PostBox;
