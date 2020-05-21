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
const { handleErrors } = require("../../utils/handle-errors.js");
const { logger } = require("app-root-path").require("/config/logger.js");
const { AuthenticateToken } = require('../../../lib/AuthenticateToken')


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
const createPostMutation = async (parent, { input }, { req }) => {
  try {

    // Validate the Post input and return errors if any
    const { msg, isValid } = validatePostInput(input);
    if (!isValid) return handleErrors("001", msg)

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);

    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return handleErrors("001", authTokenData.errors)

    //if signed in usern't does match the userId being created with the post
    if(!authTokenData.hasMatchingUserID(input.userId)) 
      return handleErrors("001", 'Signed in user does not match the user creating the post')

    // if caption is empty, make it ""
    let caption = input.caption === "undefined" ? "" : input.caption;

    // Create a Post object based on the input
    var newPost = new Post({
      userId: input.userId,
      fileId: input.fileId,
      fileType: input.fileType,
      caption: caption
    });
    newPost.save();

    return newPost;
    // Initiate sending the new post to the database
  } catch (err) {
    // Database response after post has been created
    //console.log(err);
  }
};


//==============================================================================
// Create A Comment
//==============================================================================

// @access : Private, User
// @desc   : Create a Comment Object
const createCommentMutation = async (parent, { input }, { req }) => {
  try {

    // Validate the Post input and return errors if any
    const { msg, isValid } = validateCommentInput(input);
    if (!isValid) return handleErrors("001", msg)

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);

    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return handleErrors("001", authTokenData.errors)

    //checks if the post does not exist
    var post = await Post.findById(input.postId)
    if(!post) return handleErrors("001", {postId: "post does not exist"})

    //if signed in user doesn't match the userId creating the comment
    if(!authTokenData.hasMatchingUserID(input.userId)) 
      return handleErrors("001", 'Signed in user does not match the user creating the comment')

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
    // Database response after post has been created
    console.log(err);
  }
};


//==============================================================================
// Edit A Caption
//==============================================================================

// @access : Private, User
// @desc   : Update a caption on a post object
const editCaptionMutation = async (parent, { input }, { req }) => {
  try {
    
    // Validate the Post input and return errors if any
    const { msg, isValid } = validateCaptionInput(input.newCaption);
    if (!isValid) return handleErrors("001", msg)

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);    
    
    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return handleErrors("001", authTokenData.errors)

    //checks if the post does not exist
    var post = await Post.findById(input.postId)    
    if(!post) return handleErrors("001", {postId: "post does not exist"})

    //if signed in user doesn't own the post
    if(!authTokenData.hasMatchingUserID(post.userId))
      return handleErrors("001", 'Signed in user does not own this post')

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
    //console.log(err);
  }
};



//==============================================================================
// Create A Like
//==============================================================================

// @access : Private, User
// @desc   : Create a Like Object
const createLikeMutation = async (parent, { input }, { req }) => {
  try {

    // Validate the Like input and return errors if any
    const { msg, isValid } = validateLikeInput(input);
    if (!isValid) return handleErrors("001", msg)

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);

    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return handleErrors("001", authTokenData.errors)

    //checks if the post does not exist
    var post = await Post.findById(input.postId)
    if(!post) return handleErrors("001", {postId: "post does not exist"})

    //if signed in user doesn't match the userId creating the like
    if(!authTokenData.hasMatchingUserID(input.userId)) 
      return handleErrors("001", 'Signed in user does not match the user creating the like')

    //--------check if already liked or disliked--------//
    var priorLike = await Like.findOne({userId: input.userId, postId: input.postId});
    if(priorLike){

      //if trying to like something already liked
      if(priorLike.isLike==true && input.isLike==true){
        return handleErrors("001", {isLike: "already liked"})
      }

      //if trying to dislike something already disliked
      if(priorLike.isLike==false && input.isLike==false){
        return handleErrors("001", {isLike: "already disliked"})
      }

      //if trying to like something that was disliked
      if(priorLike.isLike==false && input.isLike==true){
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
      if(priorLike.isLike==true && input.isLike==false){
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
    // Initiate sending the new like to the database
  } catch (err) {
    // Database response after like has been created
    //console.log(err);
  }
};


//==============================================================================
// Delete A Post
//==============================================================================

// @access : Private, User
// @desc   : Delete a Post Object
const deletePostMutation = async (parent, { id }, { req }) => {
  
  try {

    // Validate the input and return errors if any
    const { msg, isValid } = validateID(id);
    if (!isValid) return false
  

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);

    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return false

    let post = await Post.findById(id);
    //if post doesn't exist
    if (!post) return false
    
    //get the user who owns this post
    let postOwnerID = post.userId
    if(!postOwnerID) return false

    //if signed in user does not own this post
    if(!authTokenData.hasMatchingUserID(postOwnerID)) return false

    // Delete the post
    let deletedRecord = await post.remove();

    // return true if post deleted successfully
    if(deletedRecord) return true
    else return false
    

  } catch (err) {
    //console.log(`deletePostMutation: Failed to delete Student. ${err}.`);
    return;
  }
};

// @access : Private (user)
// @desc   : Creates a Followship
const createFollowshipMutation = async (parent, { input }, { req }) => {
  try {
    // Validate the input and return errors if any
    const { msg, isValid } = validateFollowshipInput(input);
    if (!isValid) return handleErrors("001", JSON.stringify(msg))

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);

    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return handleErrors("001", authTokenData.errors)

    //if signed in user doesn't match the userId creating the followship
    if(!authTokenData.hasMatchingUserID(input.followerId)) 
      return handleErrors("001", 'Signed in user does not match the user creating the followship')
    
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


    // Database response after object has been created
    return savedNewFollowship;

  } catch (err) {
    logger.error(
      `createFollowshipMutation: Failed to create Followship record. ${err}.`
    );
    return;
  }
};

// @access : super
// @desc   : Delete a Followship
const deleteFollowshipMutation = async (parent, { input }, { req }) => {
  try {

    // Validate the input and return errors if any
    const { msg, isValid } = validateFollowshipInput(input);
    if (!isValid) return handleErrors("001", JSON.stringify(msg))

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);

    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return false

    //if signed in user doesn't match the userId deleting the followship
    if(!authTokenData.hasMatchingUserID(input.followerId)) return false

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
    logger.error(
      `deleteFollowshipMutation: Failed to delete Followship. ${err}.`
    );
    return;
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
};
