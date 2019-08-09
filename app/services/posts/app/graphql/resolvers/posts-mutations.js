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
const bcrypt = require("bcrypt");
const { handleErrors } = require("../../utils/handle-errors.js");
const isMongodbid = require("../../utils/is-mongodbid");
const config = require("../../../config/config.js");
const { logger } = require("app-root-path").require("/config/logger.js");
//gridfs to store files
var Grid = require('gridfs-stream');
var fs = require('fs');
var testImgPath = "~/github/socialMediaFeedGeneric/testImg.jpg"
const path = require("path");
const axios = require("axios");

//---------------------------------
// Models
//---------------------------------

const Post = require("../../models/Post-model.js");
const Comment = require("../../models/Comment-model.js");
const Like = require("../../models/Like-model.js");

//---------------------------------
// Validation
//---------------------------------

const validatePostInput = require("../../validation/validatePostInput.js");
const validateCommentInput = require("../../validation/validateCommentInput.js");
const validateLikeInput = require("../../validation/validateLikeInput.js");

//==============================================================================
// Body
//==============================================================================


//==============================================================================
// Create A Post
//==============================================================================

// @access : Private, User
// @desc   : Create a Post Object
const createPostMutation = async (parent, { input }, {user}) => {
  //takes the userId from the jwt to reference post to user
  input.userId = user.id;
  // Validate the Post input and return errors if any
  const { msg, isValid } = validatePostInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  try {
    // Create a Post object based on the input
    var newPost = new Post({
      userId: input.userId,
      //picture: ,
      caption: input.caption
    });
    newPost.save();

    return newPost;
    // Initiate sending the new post to the database
  } catch (err) {
    // Database response after post has been created
    console.log(err);
  }
};


//==============================================================================
// Create A Comment
//==============================================================================

// @access : Private, User
// @desc   : Create a Comment Object
const createCommentMutation = async (parent, { input }, {user}) => {

  // Validate the Post input and return errors if any
  const { msg, isValid } = validateCommentInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  try {
    //checks if the post does not exist
    if(!(await Post.findById(input.postId))){
      return handleErrors("001", {postId: "post does not exist"});
    }

    // Create a Comment object based on the input
    var newComment = new Comment({
      userId: user.id,
      postId: input.postId,
      text: input.text,
      userName: user.name
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
// Create A Like
//==============================================================================

// @access : Private, User
// @desc   : Create a Like Object
const createLikeMutation = async (parent, { input }, {user}) => {

  // Validate the Like input and return errors if any
  const { msg, isValid } = validateLikeInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  try {

    //--------check if already liked or disliked--------//
    var priorLike = await Like.findOne({userId: user.id, postId: input.postId});
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
          userId: user.id
          },
          { $set: {isLike:true} }
        );
        var newLike = await Like.findOne({
          postId: input.postId,
          userId: user.id});
        return newLike;
      }

      //if trying to dislike something that was liked
      if(priorLike.isLike==true && input.isLike==false){
        //change the dislike to like
        await Like.updateOne({
          postId: input.postId,
          userId: user.id
          },
          { $set: {isLike:false} }
        );
        var newLike = await Like.findOne({
          postId: input.postId,
          userId: user.id});
        return newLike;
      }
    }

    //checks if the post does not exist
    if(!(await Post.findById(input.postId))){
      return handleErrors("001", {postId: "post does not exist"});
    }

    //---------  if not already liked or disliked ---------//

    // Create a Like object based on the input
    var newLike = new Like({
      userId: user.id,
      postId: input.postId,
      isLike: input.isLike
    });
    newLike.save();

    return newLike;
    // Initiate sending the new like to the database
  } catch (err) {
    // Database response after like has been created
    console.log(err);
  }
};

//==============================================================================
// Delete All Comments
//==============================================================================

// @access : Private, User
// @desc   : Delete all Comments Objects
const deleteAllCommentsMutation = async (parent, { isActual }, {user}) => {
  try{
    await Comment.deleteMany();
    return true;
  } catch (err) {
    // Database response after post has been created
    console.log(err);
    return false;
  }
};


module.exports = {
  createPostMutation,
  createLikeMutation,
  createCommentMutation,
  deleteAllCommentsMutation
};
