import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CreatePost from '../queries-mutations/CreatePost.js'
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const postsClient = new ApolloClient({
  uri: "http://localhost:3301/posts"
});

class CreatePostForm extends Component {

  constructor(props){
    super(props);

    this.state = {

    };

    //bindings
    this.handleCaptionChange = this.handleCaptionChange.bind(this);

  }

  handleCaptionChange(event) {
    this.setState({caption: event.target.value});
  }

  render(){
    return(
      <div>
       <div className="container">
          <div className="col-md-6 mx-auto text-center">
             <div className="jumbotron">
                <h1 className="wv-heading--title">
                   Share A Spicy Meme
                </h1>
             </div>
          </div>
          <div className="row">
             <div className="col-md-4 mx-auto">
                <div className="myform form ">
                   <form name="signup">
                      <div className="form-group">
                         <input onChange={this.handleCaptionChange} type="caption" name="caption"  className="form-control my-input" id="caption" placeholder="Caption" />
                      </div>
                  </form>
                </div>
                <ApolloProvider client={postsClient}>
                  <Mutation mutation={CreatePost} variables={{"input": { "caption":this.state.caption } }}>
                    {createPost => <a type="submit" href="/" onClick={createPost} className="btn btn-lg btn-primary btn-block">Submit</a>}
                  </Mutation>
                </ApolloProvider>
             </div>
          </div>
       </div>
    </div>
    );
  }



}

export default CreatePostForm;
