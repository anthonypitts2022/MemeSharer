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
!Auth  : aep2195
!Vers  : 1.0
!Date  : 7/13/19 *Last Mod
!Desc  : Contains All mutations for perms service
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
//const Comment = require("../../models/Comment-model.js");
//const Like = require("../../models/Like-model.js");
//const Dislike = require("../../models/Dislike-model.js");

//---------------------------------
// Validation
//---------------------------------

const validatePostInput = require("../../validation/validatePostInput.js");
//const validateCommentInput = require("../../validation/validateCommentInput.js");
//const validateLikeInput = require("../../validation/validateLikeInput.js"); // to make sure they don't like something more than once? maybe can just do in mutation
//const validateDislikeInput = require("../../validation/validateDislikeInput.js");


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
  // Validate the level input and return errors if any
  const { msg, isValid } = validatePostInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  try {
    // Create a Level object based on the input
    var newPost = new Post({
      userId: input.userId,
      //picture: ,
      caption: input.caption
    });
    newPost.save();

    return newPost;
    // Initiate sending the new level to the database
  } catch (err) {
    // Database response after level has been created
    console.log(err);
  }
};

module.exports = {
  createPostMutation
};
