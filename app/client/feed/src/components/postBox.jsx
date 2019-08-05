import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class PostBox extends Component {
  state= {
    likeCounter: 1,
    DislikeCounter: 0,
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
              <button
                onClick={this.handleOnDislikeClick}
                className="badge badge-pill badge-danger">Dislike</button>
              <span className="badge badge-success">{this.state.DislikeCounter}</span>


              <h5 className="card-title">{this.getCaption()}</h5>

              <p className="card-text">{this.state.comments[0]}</p>

              <form>
                <div className="form-group">
                  <label for="InputComment"></label>
                  <input type="Comment" className="form-control" id="exampleInputEmail1" aria-describedby="CommentHelp" placeholder="Enter Comment"></input>
                </div>
                <button type="submit" className="badge badge-pill badge-primary">Add Comment</button>
              </form>

            </div>
          </div>

        </div>
      </div>
    );
  }

  handleOnLikeClick= () => {
    this.setState({likeCounter:this.state.likeCounter+1});
  }
  handleOnDislikeClick= () => {
    this.setState({DislikeCounter:this.state.DislikeCounter+1});
  }

  getCaption = () => {
    const GET_POSTS = gql`
    query getAllPosts{
      caption
    }`;

    const Posts = ({ onPostSelected }) => (
      <Query query={GET_POSTS}>
        {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;


        return (
          <h5 className="card-title">{data.getAllPosts[0].caption}</h5>
        );
        }}
      </Query>
    );

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
