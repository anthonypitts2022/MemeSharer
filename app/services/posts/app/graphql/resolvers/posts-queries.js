//==============================================================================
//   __ _ _   _  ___ _ __ _   _
//  / _` | | | |/ _ \ '__| | | |
// | (_| | |_| |  __/ |  | |_| |
//  \__, |\__,_|\___|_|   \__, |
//     |_|                |___/
//
//==============================================================================
/*
!Title : perms-queries
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 7/13/19 *Last Mod
!Desc  : Conatins all the queries for perms service
*/

//==============================================================================
// Head
//==============================================================================
//---------------------------------
// Modules
//---------------------------------
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleErrors } = require("../../utils/handle-errors.js");
const config = require("../../../config/config.js");
const { logger } = require("app-root-path").require("/config/logger.js");
// const { logger } = reqlib("/config/logger.js");

//---------------------------------
// Models
//---------------------------------

const Post = require("../../models/Post-model.js");
//const Comment = require("../../models/Comment-model.js");
const Like = require("../../models/Like-model.js");


//==============================================================================
// Body
//==============================================================================


const getAllPostsQuery = async (root, { args }) => {
  const posts = await Post.find()
    .skip(0)
    .limit(200);

  try {
    return posts;
  } catch (e) {
    logger.error(`${e}`);
  }
};


const postLikeCountQuery = async (root, { postId }) => {
  try {

    const likeCount = await Like.countDocuments({postId: postId, isLike: true});
    return likeCount;

  } catch (e) {
    return handleErrors("001", {postId: "post does not exist."});
  }
};

const postDislikeCountQuery = async (root, { postId }) => {
  try {

    const dislikeCount = await Like.countDocuments({postId: postId, isLike: false});
    return dislikeCount;

  } catch (e) {
    return handleErrors("001", {postId: "post does not exist."});
  }
};



module.exports = {
  getAllPostsQuery,
  postLikeCountQuery,
  postDislikeCountQuery
};
