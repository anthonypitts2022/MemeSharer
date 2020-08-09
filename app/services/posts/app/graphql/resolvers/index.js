//==============================================================================
// _           _                                 _
// (_)_ __   __| | _____  __  _ __ ___  ___  ___ | |_   _____ _ __
// | | '_ \ / _` |/ _ \ \/ / | '__/ _ \/ __|/ _ \| \ \ / / _ \ '__|
// | | | | | (_| |  __/>  <  | | |  __/\__ \ (_) | |\ V /  __/ |
// |_|_| |_|\__,_|\___/_/\_\ |_|  \___||___/\___/|_| \_/ \___|_|
//
//==============================================================================
/*
Title: Index resolver
Auth: Anthony Pitts
Vers: 1.1
date: 7/13/19 *Last ModBODY
desc: Main resolvers component
note: Remember to export the query types resolver!
*/

//==============================================================================
// HEAD
//==============================================================================
const { handleErrors } = require("../../../lib/handleErrors.js");
const { getUser } = require('../../../APIFetches/getUser')


//bring in models
const Posts = require("../../models/Post-model.js");
const Comments = require("../../models/Comment-model.js");
const Likes = require("../../models/Like-model.js");

// posts Queries Library
const {
  getAPostQuery,
  globalPostsQuery,
  postLikeCountQuery,
  postDislikeCountQuery,
  userPostsQuery,
  feedPostsQuery,
  isFollowingQuery,
  likedQuery
} = require("./posts-queries.js");



// posts Mutation Library
const {
  createPostMutation,
  createLikeMutation,
  createCommentMutation,
  deletePostMutation,
  editCaptionMutation,
  createFollowshipMutation,
  deleteFollowshipMutation,
} = require("./posts-mutations.js");

//==============================================================================
// BODY
//==============================================================================

//---------------------------------
// Queries
//---------------------------------

const Query = {
  getAPost: getAPostQuery,
  globalPosts: globalPostsQuery,
  postLikeCount: postLikeCountQuery,
  postDislikeCount: postDislikeCountQuery,
  userPosts: userPostsQuery,
  getAPost: getAPostQuery,
  feedPosts: feedPostsQuery,
  isFollowing: isFollowingQuery,
  liked: likedQuery
};

//---------------------------------
// Mutations
//---------------------------------

const Mutation = {
  createPost: createPostMutation,
  createLike: createLikeMutation,
  createComment: createCommentMutation,
  deletePost: deletePostMutation,
  editCaption: editCaptionMutation,
  createFollowship: createFollowshipMutation,
  deleteFollowship: deleteFollowshipMutation,
};



//==============================================================================
// MODELS
//==============================================================================
const Post = {
  likeCount: async (post) => {
    try{
      return await Likes.countDocuments({postId: post.id, isLike: true});
    } catch(err){
      return handleErrors.error(err)
    }
  },
  dislikeCount: async (post) => {
    try{
      return await Likes.countDocuments({postId: post.id, isLike: false});
    } catch(err){
      return handleErrors.error(err)
    }
  },
  comments: async (post) => {
    try{
      return await Comments.find({postId: post.id}).limit(20);
    } catch(err){
      return handleErrors.error(err)
    }
  },
  user: async (post) => {
    try{
      //fetch and return the user data corresponding to this post's creator
      var user = await getUser(post.userId)
      return user && user.data && user.data.User
    } catch(err){
      console.log(err);  
      return handleErrors.error(err)
    }
  }
}


const Like = {
  user: async (like) => {
    try{
      //fetch and return the user data corresponding to this like's user
      var user = await getUser(like.userId)
      return user && user.data && user.data.User
    } catch(err){
      return handleErrors.error(err)
    }
  }
}


const Comment = {
  user: async (comment) => {
    try{
      //fetch and return the user data corresponding to this user id
      var user = await getUser(comment.userId)
      return user && user.data && user.data.User
    } catch(err){
      console.log(err);
      return handleErrors.error(err)
    }
  }
}

//==============================================================================
// !EXPORTS
//==============================================================================

//module.exports = { Query, Mutation };
module.exports = { Query, Mutation, Post, Like, Comment };
