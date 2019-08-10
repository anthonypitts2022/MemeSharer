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

// User Queries Library
const {
  userQuery,
  getAllUsersQuery,
  checkLoginQuery
} = require("./user-queries.js");

//---------------------------------
// Mutations libraies import
/*
  @Description:
  Imports all Mutation libraries
  This only handles Mutations!
*/
//---------------------------------

// User Mutation Library
const {
  createUserMutation,
  deleteAllUsersMutation
} = require("./user-mutations.js");

//==============================================================================
// BODY
//==============================================================================

//---------------------------------
// Queries
//---------------------------------

const Query = {
  user: userQuery,
  users: getAllUsersQuery,
  checkLogin: checkLoginQuery
};

//---------------------------------
// Mutations
//---------------------------------

const Mutation = {
  createUser: createUserMutation,
  deleteAllUsers: deleteAllUsersMutation
};

//==============================================================================
// !EXPORTS
//==============================================================================

module.exports = { Query, Mutation };
