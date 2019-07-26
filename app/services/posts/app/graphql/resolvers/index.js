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
Auth: aep2195
Vers: 1.1
date: 7/13/19 *Last ModBODY
desc: Main resolvers component
note: Remember to export the query types resolver!
*/

//==============================================================================
// HEAD
//==============================================================================

//---------------------------------
// Query library import
/*
  @Description:
  Imports all Query libraries
  This only handles queries!
*/
//---------------------------------

// posts Queries Library
const {
  getAllPostsQuery,
} = require("./posts-queries.js");

//---------------------------------
// Mutations libraies import
/*
  @Description:
  Imports all Mutation libraries
  This only handles Mutations!
*/
//---------------------------------

// posts Mutation Library
const {
  createPostMutation
} = require("./posts-mutations.js");

//==============================================================================
// BODY
//==============================================================================

//---------------------------------
// Queries
//---------------------------------

const Query = {
  getAllPosts: getAllPostsQuery
};

//---------------------------------
// Mutations
//---------------------------------

const Mutation = {
  createPost: createPostMutation
};




//==============================================================================
// !EXPORTS
//==============================================================================

//module.exports = { Query, Mutation };
module.exports = { Query, Mutation };
