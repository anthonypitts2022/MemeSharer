//==============================================================================
//                  _        _   _
//  _ __ ___  _   _| |_ __ _| |_(_) ___  _ __
// | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \
// | | | | | | |_| | || (_| | |_| | (_) | | | |
// |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|
//
//==============================================================================
/*
!Title : perms-Mutation
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 7/13/19 *Last Mod
!Desc  : Contains All mutations for Posts service
*/

//==============================================================================
// HEAD
//==============================================================================

//---------------------------------
// Modules
//---------------------------------
const { handleErrors } = require("../../../lib/handleErrors.js");
const { logger } = require("app-root-path").require("/config/logger.js");
const { AuthenticateAccessToken } = require('../../../lib/AuthenticateAccessToken')


//---------------------------------
// Models
//---------------------------------

const Post = require("../../models/Post-model.js");
const Comment = require("../../models/Comment-model.js");
const Like = require("../../models/Like-model.js");
const Followship = require('../../models/Followship-model.js');

//---------------------------------
// Validation
//---------------------------------

const validatePostInput = require("../../validation/validatePostInput.js");
const validateCommentInput = require("../../validation/validateCommentInput.js");
const validateCaptionInput = require("../../validation/validateCaptionInput.js");
const validateLikeInput = require("../../validation/validateLikeInput.js");
const validateID = require("../../validation/validateID.js");
const validateFollowshipInput = require('../../validation/validateFollowshipInput.js');

//==============================================================================
// Body
//==============================================================================


//==============================================================================
// Create A Post
//==============================================================================

// @access : Private, User
// @desc   : Create a Post Object
const createPostMutation = async (_, { input }, { req }) => {
  try {

    // Validate the Post input and return errors if any
    const { msg, isValid } = validatePostInput(input);
    if (!isValid) return handleErrors.invalidPostInput(msg)

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't match the userId being created with the post
    if(!accessTokenData.hasMatchingUserID(input.userId)) 
      return handleErrors.permissionDenied('Signed in user does not match the user creating the post')

    // if caption is empty, make it ""
    let caption = !input.caption ? "" : input.caption;

    // Create a Post object based on the input
    var newPost = new Post({
      userId: input.userId,
      fileId: input.fileId,
      fileType: input.fileType,
      caption: caption
    });
    newPost.save();    

    return newPost;
   
  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};


//==============================================================================
// Create A Comment
//==============================================================================

// @access : Private, User
// @desc   : Create a Comment Object
const createCommentMutation = async (_, { input }, { req }) => {
  try {

    // Validate the Post input and return errors if any
    const { msg, isValid } = validateCommentInput(input);
    if (!isValid) return handleErrors.invalidCommentInput(msg)

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //checks if the post does not exist
    var post = await Post.findById(input.postId)
    if(!post) return handleErrors.noExistingPost()

    //if signed in user doesn't match the userId creating the comment
    if(!accessTokenData.hasMatchingUserID(input.userId)) 
      return handleErrors.permissionDenied('Signed in user does not match the user creating the comment')

    // Create a Comment object based on the input
    var newComment = new Comment({
      userId: input.userId,
      postId: input.postId,
      text: input.text
    });
    newComment.save();
    return newComment;
    // Initiate sending the new post to the database
  } catch (err) {
    console.log(err);
    return handleErrors.error(err);
  }
};


//==============================================================================
// Edit A Caption
//==============================================================================

// @access : Private, User
// @desc   : Update a caption on a post object
const editCaptionMutation = async (_, { input }, { req }) => {
  try {
    
    // Validate the Post input and return errors if any
    const { msg, isValid } = validateCaptionInput(input.newCaption);
    if (!isValid) return handleErrors.invalidCaptionInput(msg)

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);    
    
    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //checks if the post does not exist
    var post = await Post.findById(input.postId)    
    if(!post) return handleErrors.noExistingPost()

    //if signed in user doesn't own the post
    if(!accessTokenData.hasMatchingUserID(post.userId))
      return handleErrors.permissionDenied('Signed in user does not own this post')

    let updatedPost = await Post.findOneAndUpdate(
      {
        _id: input.postId,
      },
      { $set: { caption: input.newCaption } },
      //new:true will return updated record
      { new: true}
    );

    return updatedPost;

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};



//==============================================================================
// Create A Like
//==============================================================================

// @access : Private, User
// @desc   : Create a Like Object
const createLikeMutation = async (_, { input }, { req }) => {
  try {

    // Validate the Like input and return errors if any
    const { msg, isValid } = validateLikeInput(input);
    if (!isValid) return handleErrors.invalidLikeInput(msg)

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //checks if the post does not exist
    var post = await Post.findById(input.postId)
    if(!post) return handleErrors.noExistingPost()

    //if signed in user doesn't match the userId creating the like
    if(!accessTokenData.hasMatchingUserID(input.userId)) 
      return handleErrors.permissionDenied('Signed in user does not match the user creating the like')

    //--------check if already liked or disliked--------//
    var priorLike = await Like.findOne({userId: input.userId, postId: input.postId});
    if(priorLike){

      //if trying to like something already liked
      if(priorLike.isLike && input.isLike){
        return handleErrors.alreadyLiked("already liked")
      }

      //if trying to dislike something already disliked
      if(!priorLike.isLike && !input.isLike){
        return handleErrors.alreadyDisliked("already disliked")
      }

      //if trying to like something that was disliked
      if(!priorLike.isLike && input.isLike){
        //change the dislike to like
        await Like.updateOne({
          postId: input.postId,
          userId: input.userId
          },
          { $set: {isLike:true} }
        );
        var newLike = await Like.findOne({
          postId: input.postId,
          userId: input.userId});
        return newLike;
      }

      //if trying to dislike something that was liked
      if(priorLike.isLike && !input.isLike){
        //change the dislike to like
        await Like.updateOne({
          postId: input.postId,
          userId: input.userId
          },
          { $set: {isLike:false} }
        );
        var newLike = await Like.findOne({
          postId: input.postId,
          userId: input.userId});
        return newLike;
      }
    }

    //---------  if not already liked or disliked ---------//

    // Create a Like object based on the input
    var newLike = new Like({
      userId: input.userId,
      postId: input.postId,
      isLike: input.isLike
    });
    newLike.save();

    return newLike;

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};


//==============================================================================
// Delete A Post
//==============================================================================

// @access : Private, User
// @desc   : Delete a Post Object
const deletePostMutation = async (_, { id }, { req }) => {
  
  try {

    // Validate the input and return errors if any
    const { msg, isValid } = validateID(id);
    if (!isValid) return false
  

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return false

    let post = await Post.findById(id);
    //if post doesn't exist
    if (!post) return false
    
    //get the user who owns this post
    let postOwnerID = post.userId
    if(!postOwnerID) return false

    //if signed in user does not own this post
    if(!accessTokenData.hasMatchingUserID(postOwnerID)) return false

    // Delete the post
    let deletedRecord = await post.remove();

    // return true if post deleted successfully
    if(deletedRecord) return true
    else return false
    

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};

// @access : Private (user)
// @desc   : Creates a Followship
const createFollowshipMutation = async (_, { input }, { req }) => {
  try {
    // Validate the input and return errors if any
    const { msg, isValid } = validateFollowshipInput(input);
    if (!isValid) return handleErrors.invalidFollowshipInput(msg)

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't match the userId creating the followship
    if(!accessTokenData.hasMatchingUserID(input.followerId)) 
      return handleErrors.permissionDenied('Signed in user does not match the user creating the followship')
    
    let followship = await Followship.findOne({ followerId: input.followerId, followeeId: input.followeeId });
    // Throw errors if already exists
    if (followship) {
      throw new Error(
        JSON.stringify({ fieldName: "This followship already exists" })
      );
    }


    // Create a user object based on the input
    const newFollowship = new Followship({
      followerId: input.followerId,
      followeeId: input.followeeId,
    });

    // Initiate sending the new object to the database
    let savedNewFollowship = await newFollowship.save();

    return savedNewFollowship;

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};

// @access : super
// @desc   : Delete a Followship
const deleteFollowshipMutation = async (_, { input }, { req }) => {
  try {

    // Validate the input and return errors if any
    const { msg, isValid } = validateFollowshipInput(input);
    if (!isValid) return handleErrors.invalidFollowshipInput(msg)

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return false

    //if signed in user doesn't match the userId deleting the followship
    if(!accessTokenData.hasMatchingUserID(input.followerId)) return false

    // Initiate the models by finding if the object below exists
    let followship = await Followship.findOne({ followerId: input.followerId, followeeId: input.followeeId });

    // Throw errors if the conditions are met
    if (!followship) {
      throw new Error(
        JSON.stringify({
          followship: `Followship doesn't exist`
        })
      );
    }

    // Delete one record
    let deletedRecord = await followship.remove();

    // return record;
    if(deletedRecord===null){
      return false;
    }
    else{
      return true;
    }

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};


// @access : user
// @desc   : Upload the file for a post
const uploadPostFileMutation = async (_, { file }, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return false

    const { stream, filename, mimetype, encoding } = await file;

    // 1. Validate file metadata.

    // 2. Stream file contents into cloud storage:
    // https://nodejs.org/api/stream.html

    // 3. Record the file upload in your DB.
    // const id = await recordFile( … )

    return { filename, mimetype, encoding };

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};


module.exports = {
  createPostMutation,
  createLikeMutation,
  createCommentMutation,
  deletePostMutation,
  editCaptionMutation,
  createFollowshipMutation,
  deleteFollowshipMutation,
  uploadPostFileMutation
};
