import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import AddLike from '../queries-mutations/AddLike.js';
import AddComment from '../queries-mutations/AddComment.js';
import axios from 'axios';
import { UserConsumer } from '../contexts/UserContext.js';
import UserContext from '../contexts/UserContext.js';



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
      comments: (typeof props.postInfo.comments === 'undefined') ? [] : props.postInfo.comments,
      addCommentText: '',
    };

    this.handleAddCommentChange = this.handleAddCommentChange.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleDislikeClick = this.handleDislikeClick.bind(this);

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

  render(){
    return(
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <img className="card-img-top" src={"http://localhost:3301/file/" + this.state.fileId +"/"+this.state.fileType} ></img>
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

PostBox.contextType = UserContext;

export default PostBox;
