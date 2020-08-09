import React, { Component } from 'react';
import UserContext from '../contexts/UserContext.js';

//MemeSharer API
const { uploadPost } = require('../APIFetches/uploadPost.js')
const { refreshAccessToken } = require('../APIFetches/refreshAccessToken')

const { hasInvalidAccessToken } = require('../lib/hasInvalidAccessToken')



class CreatePostForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      selectedFile: null,
      temporaryFileUrl: null,
      errors: [],
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
    this.setState({temporaryFileUrl: URL.createObjectURL(event.target.files[0])})
  }

  handleSubmit(event) {
    if( !localStorage.getItem('user') ){
          console.log("user not logged in");
          return;
    }
    
    //uploads file to server
    var fileData = new FormData();
    fileData.append('file', this.state.selectedFile);
    fileData.append('caption', this.state.caption);
    fileData.append('userId', JSON.parse(localStorage.getItem('user')).id);

    async function createPost( fileData ) {
      try{

        //call create post API on Post MicroService
        var newPost = await uploadPost(fileData)

        //if invalid accessToken, try to refresh it, then call function again
        if(hasInvalidAccessToken(newPost)){
          if(await refreshAccessToken())
            this.handleSubmit()
          return
        }

        //if no errors when creating post
        if(!newPost.errors)
          window.location.href = "/";
        //if errors were returned, then store them in errors field in the state
        else
          this.setState({errors: newPost.errors.split("; ") });

      }
      catch(err) {
        console.log(err);
      }
    }
    //bindings
    var bondedCreatePost = createPost.bind(this);
    bondedCreatePost(fileData);
  }


  render(){
    //if a file has not yet been uploaded
    if(!this.state.temporaryFileUrl)
    {
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
                  <div onClick={this.handleSubmit} className="btn btn-lg btn-primary btn-block">Post Meme</div>
                  <div>
                    {this.state.errors.map(error => (
                      <div key={error+"splitErrors"} >
                        <p key={error+"break"} ></p>
                        <div key={error} className="alert alert-danger" >{error}</div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
      );
    }

    //if a file has been uploaded
    else{
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
                            <img src={this.state.temporaryFileUrl} alt="temporary file upload" style={{maxWidth:"100%", maxHeight:"auto", width:"200px", height:"200px"}}/>
                          <p></p>
                           <input onChange={this.handleCaptionChange} type="caption" name="caption"  className="form-control my-input" id="caption" placeholder="Caption" />
                        </div>
                    </form>
                  </div>
                  <div onClick={this.handleSubmit} className="btn btn-lg btn-primary btn-block">Post Meme</div>
                  <div>
                    {this.state.errors.map(error => (
                      <div key={error+"splitErrors"} >
                        <p key={error+"break"} ></p>
                        <div key={error} className="alert alert-danger" >{error}</div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
      );
    }
  }



}

CreatePostForm.contextType = UserContext;

export default CreatePostForm;
