import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import AddLike from '../queries-mutations/AddLike.js';
import AddComment from '../queries-mutations/AddComment.js';
import axios from 'axios';
import { UserConsumer } from '../contexts/UserContext.js';
import UserContext from '../contexts/UserContext.js';
import styled from 'styled-components';





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
      userEmail: (typeof props.postInfo.userEmail === 'undefined') ? "" : props.postInfo.userEmail,
      comments: (typeof props.postInfo.comments === 'undefined') ? [] : props.postInfo.comments,
      addCommentText: '',
    };

    this.handleAddCommentChange = this.handleAddCommentChange.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleDislikeClick = this.handleDislikeClick.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);

  }


  handleAddCommentChange(event) {
    this.setState({addCommentText: event.target.value});
  }

  handleLikeClick(event) {
    //bind this to the addLike function
    addLike = addLike.bind(this);

    addLike();
    async function addLike() {
      try{

        if(this.context===undefined || this.context.user_email===undefined){
          window.location = "/login";
        }

        var createLikeVariables={"input": { "isLike":true, "postId": this.state.postId, "userEmail": this.context.user_email } };

        //call add like mutation
        var createLikeResponse = await axios.post("http://localhost:3301/createlike", createLikeVariables);

        //newLike holds the data of the newly created like
        var newLike = createLikeResponse.data;

        var queryPostVariables={"input": { "postId": this.state.postId } };

        //query post to get like count
        var post = await axios.post("http://localhost:3301/querypost", queryPostVariables);

        var newLikeCount = post.data.likeCount;
        var newDislikeCount = post.data.dislikeCount;

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
    addDislike = addDislike.bind(this);

    addDislike();
    async function addDislike() {
      try{
        var createLikeVariables={"input": { "isLike":false, "postId": this.state.postId, "userEmail": this.context.user_email  } };

        //call add like mutation
        var createLikeResponse = await axios.post("http://localhost:3301/createlike", createLikeVariables);

        //newLike holds the data of the newly created like
        var newLike = createLikeResponse.data;

        var queryPostVariables={"input": { "postId": this.state.postId } };

        //query post to get like count
        var post = await axios.post("http://localhost:3301/querypost", queryPostVariables);

        var newLikeCount = post.data.likeCount;
        var newDislikeCount = post.data.dislikeCount;

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
        if(this.context.user_email != this.state.userEmail)
        {
          return null;
        }

        var deletePostVariables={"id": this.state.postId };

        //call delete post mutation
        var deletePostResponse = await axios.post("http://localhost:3301/deletepost", deletePostVariables);

        //delete post holds the data of the newly created like
        var newDeletion = deletePostResponse.data;

         window.location.reload(false);

      }
      catch(err) {
        console.log(err);
      }
    }
  }

  render(){
    //if this is the signed in user's post (so they can delete it etc.)
    if(this.context.user_email === this.state.userEmail)
    {
      return(
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div style={{position:"asbolute", zIndex:"1"}}>
                <img style={{position:"relative", zIndex:"2"}} className="card-img-top" src={"http://localhost:3301/file/" + this.state.fileId +"/"+this.state.fileType} ></img>
                <div className="dropdown" style={{position:"absolute", top:"0px", zIndex:"3", right:"0px", opacity:"0.75"}}>
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <button onClick={this.handleDeletePost} className="dropdown-item">Delete Post</button>
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
                  {this.state.comments.map(comment => (
                    <div key={comment.id}>
                      <p key={comment.id+"user"} className="card-text">{comment.userName + ": "}{comment.text}</p>
                      <p key={comment.id+ "space"}></p>
                    </div>
                  ))}
                </div>

                <form>
                  <div className="form-group">
                    <label htmlFor="InputComment"></label>
                    <input type="Comment" className="form-control" onChange={this.handleAddCommentChange} id="commentInput" aria-describedby="CommentHelp" placeholder="Enter Comment"></input>
                  </div>
                  <Mutation mutation={AddComment} variables={
                    {
                      "input": {
                        "text":this.state.addCommentText,
                        "postId": this.state.postId,
                        "userEmail": this.context.user_email,
                        "userName": this.context.user_name
                      }}}>
                    {addComment => <button type="submit" onClick={this.context.user_email!=undefined ? addComment: false} className="badge badge-pill badge-primary">Add Comment</button>}
                  </Mutation>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }


    //this is not the signed-in user's post
    else{
      return(
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div style={{position:"asbolute", zIndex:"1"}}>
                <img style={{position:"relative", zIndex:"2"}} className="card-img-top" src={"http://localhost:3301/file/" + this.state.fileId +"/"+this.state.fileType} ></img>
                <div className="dropdown" style={{position:"absolute", top:"0px", zIndex:"3", right:"0px", opacity:"0.75"}}>
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
                  {this.state.comments.map(comment => (
                    <div key={comment.id}>
                      <p key={comment.id+"user"} className="card-text">{comment.userName + ": "}{comment.text}</p>
                      <p key={comment.id+ "space"}></p>
                    </div>
                  ))}
                </div>

                <form>
                  <div className="form-group">
                    <label htmlFor="InputComment"></label>
                    <input type="Comment" className="form-control" onChange={this.handleAddCommentChange} id="commentInput" aria-describedby="CommentHelp" placeholder="Enter Comment"></input>
                  </div>
                  <Mutation mutation={AddComment} variables={
                    {
                      "input": {
                        "text":this.state.addCommentText,
                        "postId": this.state.postId,
                        "userEmail": this.context.user_email,
                        "userName": this.context.user_name
                      }}}>
                    {addComment => <button type="submit" onClick={this.context.user_email!=undefined ? addComment: false} className="badge badge-pill badge-primary">Add Comment</button>}
                  </Mutation>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

PostBox.contextType = UserContext;

export default PostBox;
