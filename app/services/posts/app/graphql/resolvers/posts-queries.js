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
const { handleErrors } = require("../../../lib/handleErrors.js");
const { logger } = require("app-root-path").require("/config/logger.js");
const { AuthenticateAccessToken } = require('../../../lib/AuthenticateAccessToken')
const validateID = require("../../validation/validateID.js");

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


const globalPostsQuery = async (root, { index }) => {
  try{
    // sort the returned posts in more recent to least recent order
    // skip() will skip the first "index" number of documents
    // limit to 5 posts

    if(isNaN(index))
        return handleErrors.invalidIndex("index not a number");
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

  } catch (err) {
    logger.error(e.message);
    return handleErrors.error(err)
  }
};


const postLikeCountQuery = async (root, { postId }) => {
  try {

    const likeCount = await Like.countDocuments({postId: postId, isLike: true});
    return likeCount;

  } catch (err) {
    return handleErrors.noExistingPost()
  }
};

const postDislikeCountQuery = async (root, { postId }) => {
  try {

    const dislikeCount = await Like.countDocuments({postId: postId, isLike: false});
    return dislikeCount;

  } catch (err) {
    return handleErrors.noExistingPost()
  }
};

const userPostsQuery = async (root, { input }) => {
  try {
    //checks if user id was provided
    if(!input || !input.userId){
      return handleErrors.noUserID("Did not recieve userid");
    }



    // sort the returned posts in more recent to least recent order
    // skip() will skip the first "index" number of documents
    // limit to 5 posts

    if(isNaN(input.index))
        return handleErrors.invalidIndex("index not a number");
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

  } catch (err) {
    logger.error(err.message);
    return handleErrors.error(err)
  }
};




const isFollowingQuery = async (root, { input } ) => {
  try{

    var followship = await Followship.findOne({followerId: input.followerId, followeeId: input.followeeId});

     //check if followship does not exist
     if(!followship){
       return false;
     }
     else{
       return true;
     }

  } catch (err) {
    logger.error(err.message);
    return handleErrors.error(err)
  }
};

const likedQuery = async (root, { input } ) => {
  try{

    var like = await Like.findOne({userId: input.userId, postId: input.postId});

     return like

  } catch (err) {
    logger.error(err.message);
    return handleErrors.error(err)
  }
};


const getAPostQuery = async (root, { id } ) => {
  try{

    var post = await Post.findById(id);

     //check if post does not exist
     if(!post){
       return handleErrors.noExistingPost()
     }
     else{
       return post
     }

  } catch (err) {
    logger.error(err.message);
    return handleErrors.error(err)
  }
};


const feedPostsQuery = async (root, { input }, { req } ) => {
  //function to return most recent posts from a users followers (for the followers feed)

  try{    
    // sort the returned posts in more recent to least recent order
    // skip() will skip the first "index" number of documents
    // limit to 5 posts  
    if(isNaN(input.index))
        return handleErrors.invalidIndex("index not a number");
    index = parseInt(input.index);

    const { msg, isValid } = validateID(input.userId);
    if (!isValid) return handleErrors.invalidIDInput(msg)
    
    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)    

    //if signed in user doesn't match requested user feed
    if(!accessTokenData.hasMatchingUserID(input.userId))
      return handleErrors.permissionDenied('Signed in user does not match requested user feed')

    //get all followee id's of current user
    let followships = await Followship.find({followerId: input.userId})
    let followingIds = [];
    for (var i=0; i < followships.length; i++)
      followingIds.push({userId: followships[i].followeeId})

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

  } catch (err) {
    logger.error(err.message);
    return handleErrors.error(err)
  }
};



module.exports = {
  getAPostQuery,
  globalPostsQuery,
  postLikeCountQuery,
  postDislikeCountQuery,
  userPostsQuery,
  getAPostQuery,
  feedPostsQuery,
  isFollowingQuery,
  likedQuery
};
