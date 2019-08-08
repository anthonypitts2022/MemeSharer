import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';



class PostBox extends Component {

  constructor(props){
    super(props);

    this.state = {
      likeCount: (typeof props.postInfo.likeCount === 'undefined') ? 0: props.postInfo.likeCount,
      dislikeCount: (typeof props.postInfo.dislikeCount === 'undefined') ? 0: props.postInfo.dislikeCount,
      caption: (typeof props.postInfo.caption === 'undefined') ? "" : props.postInfo.caption
    };
  }


  render(){
    return(
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <img className="card-img-top" src="https://tinyurl.com/yxl6uy3s" width="200" height="200"></img>
            <div className="card-body">
              <button
                onClick={this.handleOnLikeClick}
                className="badge badge-pill badge-primary">Like</button>
              <span className="badge badge-success">{this.state.likeCount}</span>
              <button
                onClick={this.handleOnDislikeClick}
                className="badge badge-pill badge-danger">Dislike</button>
              <span className="badge badge-success">{this.state.dislikeCount}</span>


              <h5 className="card-title">{this.state.caption}</h5>

              <form>
                <div className="form-group">
                  <label htmlFor="InputComment"></label>
                  <input type="Comment" className="form-control" id="exampleInputEmail1" aria-describedby="CommentHelp" placeholder="Enter Comment"></input>
                </div>
                <button type="submit" onClick={this.handleAddComment} className="badge badge-pill badge-primary">Add Comment</button>
              </form>

            </div>
          </div>

        </div>
      </div>
    );
  }

  handleOnLikeClick= () => {
    this.setState({likeCount:this.state.likeCount+1});
  }
  handleOnDislikeClick= () => {
    this.setState({dislikeCount:this.state.dislikeCount+1});
  }


  handleAddComment= () => {
    //need to add new comment array by looping through old one
    //or just start mutations and queries with node
    this.setState({
      comments: ["hey"]
    });
  }


}

export default PostBox;
