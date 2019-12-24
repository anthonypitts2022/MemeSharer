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
const { handleErrors } = require("../../utils/handle-errors.js");

//bring in models
//const Post = require("../../models/Post-model.js");
const Comment = require("../../models/Comment-model.js");
const Like = require("../../models/Like-model.js");

// posts Queries Library
const {
  getAPostQuery,
  getAllPostsQuery,
  postLikeCountQuery,
  postDislikeCountQuery,
  userPostsQuery,
  feedPostsQuery
} = require("./posts-queries.js");



// posts Mutation Library
const {
  createPostMutation,
  createLikeMutation,
  createCommentMutation,
  deleteAllCommentsMutation,
  deleteAllPostsMutation,
  deletePostMutation,
  uploadImageToServerMutation
} = require("./posts-mutations.js");

//==============================================================================
// BODY
//==============================================================================

//---------------------------------
// Queries
//---------------------------------

const Query = {
  getAPost: getAPostQuery,
  getAllPosts: getAllPostsQuery,
  postLikeCount: postLikeCountQuery,
  postDislikeCount: postDislikeCountQuery,
  userPosts: userPostsQuery,
  getAPost: getAPostQuery,
  feedPosts: feedPostsQuery
};

//---------------------------------
// Mutations
//---------------------------------

const Mutation = {
  createPost: createPostMutation,
  createLike: createLikeMutation,
  createComment: createCommentMutation,
  deleteAllComments: deleteAllCommentsMutation,
  deleteAllPosts: deleteAllPostsMutation,
  deletePost: deletePostMutation,
  uploadImageToServer: uploadImageToServerMutation
};



//==============================================================================
// MODELS
//==============================================================================
const Post = {
  likeCount: async (post) => {
    try{
      return await Like.countDocuments({postId: post.id, isLike: true});
    } catch(err){
      return handleErrors("001", {postId: "post does not exist."})
    }
  },
  dislikeCount: async (post) => {
    try{
      return await Like.countDocuments({postId: post.id, isLike: false});
    } catch(err){
      return handleErrors("001", {postId: "post does not exist."})
    }
  },
  comments: async (post) => {
    try{
      return await Comment.find({postId: post.id}).limit(20);
    } catch(err){
      return handleErrors("001", {postId: "failed to get comments"})
    }
  },
}

//==============================================================================
// !EXPORTS
//==============================================================================

//module.exports = { Query, Mutation };
module.exports = { Query, Mutation, Post };
