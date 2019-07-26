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

// Perms Queries Library
const {
  getLevelQuery,
  haveAuthQuery,
  whoHasAccessQuery,
  uniAccessQuery
} = require("./perms-queries.js");

//---------------------------------
// Mutations libraies import
/*
  @Description:
  Imports all Mutation libraries
  This only handles Mutations!
*/
//---------------------------------

// Perms Mutation Library
const {
  createUserPermsMutation,
  createLevelMutation
} = require("./perms-mutations.js");

//==============================================================================
// BODY
//==============================================================================

//---------------------------------
// Queries
//---------------------------------

const Query = {
  getLevel: getLevelQuery,
  haveAuth: haveAuthQuery,
  whoHasAccess: whoHasAccessQuery,
  uniAccess: uniAccessQuery
};

//---------------------------------
// Mutations
//---------------------------------

const Mutation = {
  createUserPerms: createUserPermsMutation,
  createLevel: createLevelMutation
};




//==============================================================================
// !EXPORTS
//==============================================================================

//module.exports = { Query, Mutation };
module.exports = { Query, Mutation };
