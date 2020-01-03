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
const { PostsDateSort } = require("../../utils/PostsArrDateSort.js");

//---------------------------------
// Models
//---------------------------------

const Post = require("../../models/Post-model.js");
const Comment = require("../../models/Comment-model.js");
const Like = require("../../models/Like-model.js");
const Followship = require('../../models/Followship-model.js');



//==============================================================================
// Body
//==============================================================================


const getAllPostsQuery = async (root, { index }) => {
  try{
    // sort the returned posts in more recent to least recent order
    // skip() will skip the first "index" number of documents
    // limit to 5 posts

    if(isNaN(index))
        return handleErrors("001", {index: "index not a number"});
    index = parseInt(index);


    let posts = await Post.find()
                           .sort({date: -1})
                           .skip( index )
                           .limit(5);


    //hasNext checks if it could return a 21st post
    let hasNext = 1 === (await Post.find()
                                   .sort({date: -1})
                                   .skip( index + 5 )
                                   .limit(1)).length



    return {posts: posts, hasNext: hasNext};

  } catch (e) {
    logger.error(e.message);
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

const userPostsQuery = async (root, { input }) => {
  try {
    //checks if user is signed in
    if(!input.userId){
      return handleErrors("001", {user: "Did not recieve userid"});
    }



    // sort the returned posts in more recent to least recent order
    // skip() will skip the first "index" number of documents
    // limit to 5 posts

    if(isNaN(input.index))
        return handleErrors("001", {index: "index not a number"});
    index = parseInt(input.index);



    let posts = await Post.find({userId: input.userId})
                           .sort({date: -1})
                           .skip( index )
                           .limit(5);


    //hasNext checks if it could return a 21st post
    let hasNext = 1 === (await Post.find({userId: input.userId})
                                   .sort({date: -1})
                                   .skip( index + 5 )
                                   .limit(1)).length



    return {posts: posts, hasNext: hasNext};

  } catch (e) {
    logger.error(e.message);
  }
};


const getAPostQuery = async (root, { id } ) => {
  try{

    var post = await Post.findById(id);

     //check if post does not exist
     if(!post){
       return handleErrors("001", {postId: "post does not exist."});
     }
     else{
       return post
     }

  } catch (e) {
    logger.error(e.message);
  }
};


const feedPostsQuery = async (root, { input } ) => {
  //function to return most recent posts from a users followers (for the main feed)

  try{
    // sort the returned posts in more recent to least recent order
    // skip() will skip the first "index" number of documents
    // limit to 5 posts

    if(isNaN(input.index))
        return handleErrors("001", {index: "index not a number"});
    index = parseInt(input.index);


    //get all followee id's of current user
    let followships = await Followship.find({followerId: input.userId})
    let followingIds = [];
    for (var i=0; i < followships.length; i++)
    {
      followingIds.push({userId: followships[i].followeeId})
    }

    //if not following anyone
    if(followingIds.length ===0 )
        return {posts: [], hasNext: false};

    let posts = await Post.find({$or: followingIds})
                           .sort({date: -1})
                           .skip( index )
                           .limit(5);


    //hasNext checks if it could return a 21st post
    let hasNext = 1 === (await Post.find({$or: followingIds})
                                   .sort({date: -1})
                                   .skip( index + 5 )
                                   .limit(1)).length



    return {posts: posts, hasNext: hasNext};

  } catch (e) {
    logger.error(e.message);
  }
};



module.exports = {
  getAPostQuery,
  getAllPostsQuery,
  postLikeCountQuery,
  postDislikeCountQuery,
  userPostsQuery,
  getAPostQuery,
  feedPostsQuery
};
