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


//==============================================================================
// Body
//==============================================================================


const getAllPostsQuery = async (root, { args }) => {
  try{
    const posts = await Post.find()
      .skip(0)
      .limit(200);

    return PostsDateSort(posts);

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

const userPostsQuery = async (root, { args }, {user}) => {
  try {
    //checks if user is signed in
    if(!user){
      return handleErrors("001", {user: "user not signed in"});
    }
    //gets 200 post from user
    const posts = await Post.find({userId: user.id});

    //if no posts were found
    if(!posts){
      return handleErrors("001", {posts: "no post for this user"});
    }
    return PostsDateSort(posts);
  } catch (e) {
    logger.error(e.message);
  }
};


const getAPostQuery = async (root, { input } ) => {
  try{
    var post = await Post.findById(input.postId);

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


const feedPostsQuery = async (root, { input }, {user} ) => {
  //function to return most recent posts from a users followers (for the main feed)

  try{
    var posts = [];
    //loop through the inputted array of current user's following list
    for(var index in input.followerIds){
      if(input.followerIds.hasOwnProperty(index)){
         try{
           //find out if number of user's posts is less than 10
           var lessThanTen = false;
           var numUserPosts = await Post.countDocuments({ userId: input.followerIds[index] });
           if(10 > numUserPosts){
             lessThanTen = true;
           }

           //get the user's posts
           var userPostsSorted = PostsDateSort(await Post.find({ userId: input.followerIds[index] }));

           //push the ten most recent posts from a users page to the posts list
           if(lessThanTen==false){
             posts = posts.concat(userPostsSorted.slice(0,10) );
           }
           //push all users posts if they have less than 10
           else{
             if(numUserPosts!=0){
               posts = posts.concat(userPostsSorted.slice(0,numUserPosts) );
             }
           }
         } catch(e){
           continue;
         }
      }
    }

    //sort all posts by date
    var dateSortedPosts = PostsDateSort(posts);
    //Should store this array in database so they can hit a "load more" and get next 25 posts
    var numPostsFromFollowers = dateSortedPosts.length;
    //return all posts if less than or equal to 25
    if(numPostsFromFollowers<=25){
      return dateSortedPosts;
    }
    //return the most recent 25 posts for feed
    return dateSortedPosts.slice(0,25);

  } catch (e) {
    logger.error(e.message);
    return handleErrors("001", {feed: "could not retrieve feed"});
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
