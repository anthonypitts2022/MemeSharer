import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext.js';
import { Image } from 'react-native';
import { Icon } from '@iconify/react';
import ellipsisH from '@iconify/icons-fa/ellipsis-h';
import userIcon from '@iconify/icons-simple-line-icons/user';
import userFollowing from '@iconify/icons-simple-line-icons/user-following';
import thumbsUp from '@iconify/icons-dashicons/thumbs-up';
import thumbsDown from '@iconify/icons-dashicons/thumbs-down';
import $ from "jquery"
import { PostBoxFunctions } from './postBoxFunctions'
const shortid = require('shortid')



class PostBox extends Component {

  constructor(props){
    super(props);

    var post = props && props.postInfo;

    this.state = {
      componentID: shortid.generate(),
      fileId: (!post || !post.fileId) ? "" : post.fileId,
      fileType: (!post || !post.fileType) ? "" : post.fileType,
      likeCount: (!post || !post.likeCount) ? 0: post.likeCount,
      dislikeCount: (!post || !post.dislikeCount) ? 0: post.dislikeCount,
      caption: (!post || !post.caption) ? "" : post.caption,
      postId: (!post || !post.id) ? "" : post.id,
      userEmail: (!post || !post.user || !post.user.email) ? "" : post.user.email,
      profileUrl: (!post || !post.user || !post.user.profileUrl) ? "" : post.user.profileUrl,
      username: (!post || !post.user || !post.user.name) ? "" : post.user.name,
      userId: (!post || !post.user || !post.user.id) ? "" : post.user.id,
      comments: (!post || !post.comments) ? [] : post.comments,
      addCommentText: '',
      newCaption: null,
      visibleComments: 3,
      deleted: false,
      followingUserOfPost: false,
      modalIdentifier: shortid.generate()
    };

    this.postBoxFunctions = new PostBoxFunctions(this);


  }


  componentDidMount(){

    async function getFollowingStatus() {
      this.setState({followingUserOfPost: await this.postBoxFunctions.followingStatus()})
    }
    //bind this to the function
    var boundGetFollowingStatus = getFollowingStatus.bind(this);
    boundGetFollowingStatus();

    this.postBoxFunctions.checkLikeStatus()

    this.postBoxFunctions.setupOnClicks()

  }
  

  render(){

    //if post has been deleted
    if(this.state.deleted)
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
    if(this.state.comments.length > this.state.visibleComments)
      loadMoreCommentsButton = <button type="button" className={`btn btn-sm btn-success loadMoreCommentsBtn${this.state.componentID}`} style={{fontSize:'12px'}}>View More Comments</button>;

    // if this post is not by the current user, then display a follow/followed button
    let followingUserOfPostButton;
    //if user is signed in
    if( localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).id )
    {
      if (JSON.parse(localStorage.getItem('user')).id !== this.state.userId && this.state.userId!==""){
        // if following
        if(this.state.followingUserOfPost)
          followingUserOfPostButton = $(<button className="btn btn-lg btn-secondary " type="button" key={`followingUserOfPostBtn${this.state.componentID}`} id={`followingUserOfPostBtn${this.state.componentID}`} style={{backgroundColor: 'Transparent', border:'none',  color:'black'}}><Icon icon={userFollowing} /></button>)
        // if not following
        else
          followingUserOfPostButton = $(<button className="btn btn-lg btn-secondary " type="button" key={`unfollowingUserOfPostBtn${this.state.componentID}`} id={`unfollowingUserOfPostBtn${this.state.componentID}`} style={{backgroundColor: 'Transparent', border:'none',  color:'black'}}><Icon icon={userIcon} /></button>)
      }
    }

    let postSettingsButtons;
    //if this is the signed in user's post (so they can delete it etc.)
    if(JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).id === this.state.userId)
    {
      postSettingsButtons =
      <div>
        <button type="button" className="dropdown-item" data-toggle="modal" data-target={"#editCaptionModal"+this.state.componentID} >Edit Caption</button>
        <button onClick={this.postBoxFunctions.handleDeletePost} className="dropdown-item">Delete Post</button>
        <button onClick={this.postBoxFunctions.handleCopyLink} className="dropdown-item">Copy Link</button>
      </div>
    }
    //if this is not the signed in user's post (so they can't delete it etc.)
    else{
      postSettingsButtons =
      <div>
        <button onClick={this.postBoxFunctions.handleCopyLink} className="dropdown-item">Copy Link</button>
      </div>
    }

    let captionArea;
    if(this.state.caption.split(" ").join("")!=="")
      captionArea = <h5 className="card-title" style={{fontSize:'17px'}}><span style={{fontWeight:'bold'}}>{this.state.username+": "}</span>{this.state.caption}</h5>

    return(
      <div className="container">

        <div className="modal fade" id={"editCaptionModal"+this.state.componentID} tabIndex="-1" role="dialog" aria-labelledby="editCaptionModalLabel" aria-hidden="true">
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
                  <input id={`${this.state.componentID}newCaptionInput`} type="Comment" className="form-control" onChange={this.postBoxFunctions.handleAddCaptionChange} aria-describedby="CommentHelp" placeholder="Enter New Caption"></input>
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className={`btn btn-primary editCaptionSubmit${this.state.componentID}`} data-dismiss="modal">Save changes</button>
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
                  <span className={`followBtnArea${this.state.componentID}`}>
                    {followingUserOfPostButton}
                  </span>
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

              <Icon style={{fontSize:'25px'}} onClick={this.postBoxFunctions.handleLikeClick} icon={thumbsUp} className={"thumbsUp"+this.state.componentID}/>&nbsp;
              <span style={{fontSize:'25px', fontWeight:'bold', display:'inline-block', height:'1.2em', verticalAlign:'bottom'}} >{this.state.likeCount}</span>&nbsp;&nbsp;

              <Icon style={{fontSize:'25px'}} onClick={this.postBoxFunctions.handleDislikeClick} icon={thumbsDown} className={"thumbsDown"+this.state.componentID}/>&nbsp;
              <span style={{fontSize:'25px', fontWeight:'bold', display:'inline-block', height:'1.2em', verticalAlign:'bottom'}} >{this.state.dislikeCount}</span>

              {captionArea}

              <span>
                {this.state.comments.slice(0,this.state.visibleComments).map(comment => (
                  <div key={comment.id}>
                    <p key={comment.id+"user"} className="card-text"><span style={{fontWeight: 'bold', fontSize:'15'}}>{comment.user.name + ": "}</span>{comment.text}</p>
                  </div>
                ))}
              </span>
              <div id="followUnfollowArea">
                {loadMoreCommentsButton}
              </div>

              <div className="input-group mb-3" style={{paddingTop:'5px'}}>
                <input type="Comment" className={`form-control commentInput${this.state.componentID}`} onChange={this.postBoxFunctions.handleAddCommentChange} placeholder="Enter Comment"></input>
                <div className="input-group-append">
                  <button className={`btn btn-outline-secondary submitCommentBtn${this.state.componentID}`} onClick={this.postBoxFunctions.handleAddComment}>Post</button>
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
