import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { graphql } from 'react-apollo';
import { Query, Mutation } from 'react-apollo';
import { useMutation } from 'react-apollo-hooks';
import CreatePost from '../queries-mutations/CreatePost.js';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import axios from 'axios';
var multer = require('multer');
const { createApolloFetch } = require('apollo-fetch');
const shortid = require("shortid");


const postsClient = new ApolloClient({
  uri: "http://localhost:3301/posts"
});

class CreatePostForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      selectedFile: null
    };

    //bindings
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleCaptionChange(event) {
    this.setState({caption: event.target.value});
  }

  handleFileChange(event) {
    this.setState({selectedFile: event.target.files[0]});
  }

  handleSubmit(event) {
    //resizes image file
    console.log(this.state.selectedFile);
    var reader = new FileReader();



    //uploads file to server
    var fileData = new FormData();
    fileData.append('file', this.state.selectedFile);
    fileData.append('caption', this.state.caption);

    axios.post("http://localhost:3301/upload", fileData);
    window.location.href = "/";
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
                   <form name="postUpload">
                      <div className="form-group">
                        <div className="custom-file mb-3">
                          <input type="file" name="file" id="file" onChange={this.handleFileChange} className="custom-file-input"/>
                          <label htmlFor="file" className="custom-file-label">Choose File</label>
                        </div>
                        <p></p>
                         <input onChange={this.handleCaptionChange} type="caption" name="caption"  className="form-control my-input" id="caption" placeholder="Caption" />
                      </div>
                  </form>
                </div>
                <a type="submit" onClick={this.handleSubmit} className="btn btn-lg btn-primary btn-block">Submit</a>
             </div>
          </div>
       </div>
    </div>
    );
  }



}

export default CreatePostForm;
