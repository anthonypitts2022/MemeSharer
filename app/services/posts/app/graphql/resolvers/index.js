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
const { createApolloFetch } = require('apollo-fetch');


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
  isFollowingQuery
} = require("./posts-queries.js");



// posts Mutation Library
const {
  createPostMutation,
  createLikeMutation,
  createCommentMutation,
  deletePostMutation,
  editCaptionMutation,
  createFollowshipMutation,
  deleteFollowshipMutation
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
  isFollowing: isFollowingQuery
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
  deleteFollowship: deleteFollowshipMutation
};



//==============================================================================
// MODELS
//==============================================================================
const Post = {
  likeCount: async (post) => {
    try{
      return await Likes.countDocuments({postId: post.id, isLike: true});
    } catch(err){
      return handleErrors("001", {postId: "post does not exist."})
    }
  },
  dislikeCount: async (post) => {
    try{
      return await Likes.countDocuments({postId: post.id, isLike: false});
    } catch(err){
      return handleErrors("001", {postId: "post does not exist."})
    }
  },
  comments: async (post) => {
    try{
      return await Comments.find({postId: post.id}).limit(20);
    } catch(err){
      return handleErrors("001", {postId: "failed to get comments"})
    }
  },
  user: async (post) => {
    try{
      //calls database mutation
      var fetch = createApolloFetch({
        uri: "http://localhost:3002/user"
      });

      //fetch and return the user data corresponding to this user id
      return await fetch({
        query:
        `
        query user($id: String!){
          User: user(id: $id){
            errors{
              msg
            }
            id
            name
            email
            profileUrl
          }
        }
        `,
        variables: {
          id: post.userId,
        }
      })
      .then(result => {
        //result.data holds the data returned from the mutation
        return result.data.User;
      })
    } catch(err){
      return handleErrors("001", {postId: "failed to get post's user"})
    }
  }
}


const Like = {
  user: async (like) => {
    try{
      //calls database mutation
      var fetch = createApolloFetch({
        uri: "http://localhost:3002/user"
      });

      //fetch and return the user data corresponding to this user id
      return await fetch({
        query:
        `
        query user($id: String!){
          User: user(id: $id){
            errors{
              msg
            }
            id
            name
            email
            profileUrl
          }
        }
        `,
        variables: {
          id: like.userId,
        }
      })
      .then(result => {
        //result.data holds the data returned from the mutation
        return result.data.User;
      })
    } catch(err){
      return handleErrors("001", {postId: "failed to get like's user"})
    }
  }
}


const Comment = {
  user: async (comment) => {
    try{
      //calls database mutation
      var fetch = createApolloFetch({
        uri: "http://localhost:3002/user"
      });

      //fetch and return the user data corresponding to this user id
      return await fetch({
        query:
        `
        query user($id: String!){
          User: user(id: $id){
            errors{
              msg
            }
            id
            name
            email
            profileUrl
          }
        }
        `,
        variables: {
          id: comment.userId,
        }
      })
      .then(result => {
        //result.data holds the data returned from the mutation
        return result.data.User;
      })
    } catch(err){
      return handleErrors("001", {postId: "failed to get comments's user"})
    }
  }
}

//==============================================================================
// !EXPORTS
//==============================================================================

//module.exports = { Query, Mutation };
module.exports = { Query, Mutation, Post, Like, Comment };
