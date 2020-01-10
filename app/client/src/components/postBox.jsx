import React, { Component } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext.js';
import { Image } from 'react-native';
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


  }


  componentDidMount(){

    //bind this to the function
    getFollowingStatus = getFollowingStatus.bind(this);
    getFollowingStatus();
    async function getFollowingStatus() {
      this.setState({followingUserOfPost: await this.followingStatus()})
    }

  }




  handleAddCommentChange(event) {
    this.setState({addCommentText: event.target.value});
  }

  handleAddCaptionChange(event) {
    if(event.target.value != ""){
      this.setState({newCaption: event.target.value});
    }
    else{
      this.setState({newCaption: null});
    }
  }

  handleAddComment(event) {

    //bind this to the addLike function
    addComment = addComment.bind(this);

    addComment();
    async function addComment() {
      try{

        if(this.context===undefined || this.context.user_id===undefined){
          window.location = "/login";
        }

        var createCommentVariables={
          "input": {
            "text": this.state.addCommentText,
            "postId": this.state.postId,
            "userId": this.context.user_id
          }
        };


        //calls create comment database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
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
        console.log(err);
      }

      }
  }

  handleLikeClick(event) {
    //bind this to the addLike function
    addLike = addLike.bind(this);

    addLike();
    async function addLike() {
      try{

        if(this.context===undefined || this.context.user_id===undefined){
          window.location = "/login";
        }

        var createLikeVariables={"input": { "isLike":true, "postId": this.state.postId, "userId": this.context.user_id } };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
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
        console.log(err);
      }
    }
  }

  handleDislikeClick(event) {
    //bind this to the addLike function
    addLike = addLike.bind(this);

    addLike();
    async function addLike() {
      try{

        if(this.context===undefined || this.context.user_id===undefined){
          window.location = "/login";
        }

        var createLikeVariables={"input": { "isLike":false, "postId": this.state.postId, "userId": this.context.user_id } };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
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
        console.log(err);
      }
    }
  }


  handleDeletePost(event) {
    //bind this to the deletePost function
    deletePost = deletePost.bind(this);

    deletePost();
    async function deletePost() {
      try{
        if(this.context===undefined || this.context.user_id===undefined){
          window.location = "/login";
        }
        if(this.context.user_email != this.state.userEmail)
        {
          return null;
        }

        var deletePostVariables={"id": this.state.postId };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
        });

        //binds the variables for query to fetch
        fetch = fetch.bind(deletePostVariables)

        let deletePostResponse = await fetch({
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
        console.log(err);
      }
    }
  }


  handleEditCaption(event) {
    //bind this to the deletePost function
    editCaption = editCaption.bind(this);

    editCaption();
    async function editCaption() {
      try{

        // clear add new caption input from modal
        document.getElementById("captionInput"+this.state.postId).value = ''

        if(this.context===undefined || this.context.user_id===undefined){
          window.location = "/login";
        }
        if(this.context.user_email != this.state.userEmail)
          return;
        if(this.state.newCaption === null)
          return;

        var editCaptionVariables={
          "input": {
            "postId": this.state.postId,
            "newCaption": this.state.newCaption
          }
        };

        //calls create like database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
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
          return;

        this.setState({caption: editCaptionResponse.data.Post.caption});
        this.setState({newCaption: null});


      }
      catch(err) {
        console.log(err);
      }
    }
  }


  handleCopyLink(event) {
    //bind this to the copyLink function
    copyLink = copyLink.bind(this);

    copyLink();
    async function copyLink() {
      try{
        let link = ""
        //if in local host dev
        if(window.location.hostname==="localhost"){
          link = window.location.hostname + ":" +
                  window.location.port + "/post/" + this.state.postId;
        }
        //if in production
        else{
          link = "www." + window.location.hostname + ".com/post/" + this.state.postId;
        }

        //copy post link to clipboard
        navigator.clipboard.writeText(link);

      }
      catch(err) {
        console.log(err);
      }
    }
  }

  loadMoreComments(event) {
    this.setState({visibleComments: this.state.visibleComments + 3});
  }

  followingStatus(){

    //bind this to the addLike function
    getFollowingButton = getFollowingButton.bind(this);

    return getFollowingButton();
    async function getFollowingButton() {
      try{

        var isFollowingVariables={
          "input": {
            "followerId": this.context.user_id,
            "followeeId": this.state.userId
          }
        };


        //calls create comment database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
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
        console.log(err);
      }

      }
  }

  followUserOfPost(){

    //bind this to the addLike function
    follow = follow.bind(this);

    follow();
    async function follow() {
      try{

        var createFollowshipVariables={
          "input": {
            "followerId": this.context.user_id,
            "followeeId": this.state.userId
          }
        };


        //calls database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
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
        console.log(err);
      }

      }
  }

  unfollowUserOfPost(){

    //bind this to the addLike function
    unfollow = unfollow.bind(this);

    unfollow();
    async function unfollow() {
      try{

        var deleteFollowshipVariables={
          "input": {
            "followerId": this.context.user_id,
            "followeeId": this.state.userId
          }
        };


        //calls database mutation
        var fetch = createApolloFetch({
          uri: "http://localhost:3301/posts"
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
        console.log(err);
      }

      }
  }

  render(){

    //if post has been deleted
    if(this.state.deleted === true)
    return(
      <div className="row">
        <div className="col-md-6 offset-md-4">
          <div className="card" style={{width:"40rem"}}>
            <a className="card-body">
              <p className="text-center font-weight-bold"><font color="#ff1a1a">This Post Has Been Deleted</font></p>
            </a>
          </div>
        </div>
      </div>
    )

    // if there are more comments that can be displayed
    let loadMoreCommentsButton;
    if(this.state.comments.length > this.state.visibleComments){
      loadMoreCommentsButton = <button onClick={this.loadMoreComments} type="button" className="btn btn-sm btn-success">View More Comments</button>;
    }

    // if this post is not by the current user, then display a follow/followed button
    let followingUserOfPostButton;
    if(this.context.user_id != this.state.userId && this.state.followingUserOfPost!=null){
      // if following
      if(this.state.followingUserOfPost){
        followingUserOfPostButton = <button type="button" className="btn btn-light" onClick={this.unfollowUserOfPost}>Following</button>
      }
      // if not following
      else{
        followingUserOfPostButton = <button type="button" className="btn btn-primary" onClick={this.followUserOfPost}>Follow</button>
      }
    }



    let postSettingsButtons;
    //if this is the signed in user's post (so they can delete it etc.)
    if(this.context.user_id === this.state.userId)
    {
      postSettingsButtons =
      <div>
        <button type="button" className="dropdown-item" data-toggle="modal" data-target="#editCaptionModal">Edit Caption</button>
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
      <div>

        <div className="modal fade" id="editCaptionModal" tabIndex="-1" role="dialog" aria-labelledby="editCaptionModalLabel" aria-hidden="true">
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
                  <input id={this.state.postId + "newCaptionInput"} type="Comment" className="form-control" onChange={this.handleAddCaptionChange} id={"captionInput"+this.state.postId} aria-describedby="CommentHelp" placeholder="Enter New Caption"></input>
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.handleEditCaption} data-dismiss="modal">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="offset-md-4">
          <div className="card" style={{width:"40rem"}}>
            <div className="card-body">
              <div className="row">
                <a className="col-1.5" href={"/profile/"+this.state.userId} style={{textDecoration:"none"}}>
                  <Image
                    source={{uri: this.state.profileUrl}}
                    style={{width: 60, height: 60, borderRadius: 60/ 2}}
                  />
                </a>
                <div className="col">
                  <p href={"/profile/"+this.state.userId} style={{textDecoration:"none"}}></p>
                  <a className="col-8" href={"/profile/"+this.state.userId} style={{textDecoration:"none"}}>
                    <font color="006699"><span className="glyphicon glyphicon-user"></span>{this.state.username}</font>
                  </a>
                  {followingUserOfPostButton}
                </div>
              </div>
            </div>
            <div style={{position:"asbolute", zIndex:"1"}}>
              <img style={{position:"relative", zIndex:"2"}} className="card-img-top" src={"http://localhost:3301/file/" + this.state.fileId +"/"+this.state.fileType} ></img>
              <div className="dropdown" style={{position:"absolute", top:"0px", zIndex:"3", right:"0px", opacity:"0.75"}}>
                <button className="btn btn-lg btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {postSettingsButtons}
                </div>
              </div>
            </div>
            <div className="card-body">
              <button onClick={this.handleLikeClick} className="badge badge-pill badge-primary">Like</button>
              <span className="badge badge-success">{this.state.likeCount}</span>

              <button onClick={this.handleDislikeClick} className="badge badge-pill badge-danger">Dislike</button>
              <span className="badge badge-success">{this.state.dislikeCount}</span>

              <h5 className="card-title">{this.state.caption}</h5>

              <div>
                {this.state.comments.slice(0,this.state.visibleComments).map(comment => (
                  <div key={comment.id}>
                    <p key={comment.id+"user"} className="card-text">{comment.user.name + ": "}{comment.text}</p>
                    <p key={comment.id+ "space"}></p>
                  </div>
                ))}
              </div>
              <div>
                {loadMoreCommentsButton}
              </div>

              <div className="form-group">
                <label htmlFor="InputComment"></label>
                <input type="Comment" className="form-control" onChange={this.handleAddCommentChange} id={"commentInput"+this.state.postId} aria-describedby="CommentHelp" placeholder="Enter Comment"></input>
              </div>
              <button type="submit" onClick={this.context.user_id!=undefined ? this.handleAddComment : false} className="badge badge-pill badge-primary">Add Comment</button>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

PostBox.contextType = UserContext;

export default PostBox;
