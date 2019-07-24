import React, { Component } from 'react';

class PostBox extends Component {
  state= {
    likeCounter: 1,
    comments: [
      "This is the default commment."
    ]
  };

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
              <span className="badge badge-success">{this.state.likeCounter}</span>
              <h5 className="card-title">This is the caption</h5>
              <p className="card-text">These are</p>
              <p className="card-text">different</p>
              <p className="card-text">comments on a post</p>
              <p className="card-text">{this.state.comments[0]}</p>

              <button
                onClick={this.handleAddComment}
                className="badge badge-pill badge-primary">Add Comment</button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  handleOnLikeClick= () => {
    this.setState({likeCounter:this.state.likeCounter+1});
  }


  handleAddComment= () => {
    //need to add new comment array by looping through old one
    //or just start mutations and queries with node
    this.setState({
      likeCounter:this.state.likeCounter
    });
  }


}

export default PostBox;
