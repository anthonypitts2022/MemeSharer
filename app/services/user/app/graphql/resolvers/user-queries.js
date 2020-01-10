//==============================================================================
//   __ _ _   _  ___ _ __ _   _
//  / _` | | | |/ _ \ '__| | | |
// | (_| | |_| |  __/ |  | |_| |
//  \__, |\__,_|\___|_|   \__, |
//     |_|                |___/
//
//==============================================================================
/*
!Title : user-queries
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 11/21/19 *Last Mod
!Desc  : Conatins all the queries for users
*/

//==============================================================================
// Head
//==============================================================================
//---------------------------------
// Modules
//---------------------------------
require("module-alias/register");
const { logger } = require("@lib/logger");
const { handleErrors } = require("@lib/handle-errors");
const jwt = require("jsonwebtoken");

const config = require("../../../config/config.js");

// const { logger } = reqlib("/config/logger.js");

//---------------------------------
// Models
//---------------------------------

const User = require("../../models/User-model.js");
//==============================================================================
// Body
//==============================================================================

// @access : Private(Root, Admin, Staff)
// @desc   : Get a user
const userQuery = async (root, { id }) => {
  const user = await User.findOne({ id: id });
  try {
    return user;
  } catch (e) {
    logger.error(`${e}`);
  }
};

// @access : Private(Root)
// @desc   : Existing users
const usersQuery = async (root, { args }, { user }) => {
  // TODO: Add perms
  const users = await User.find()
    .skip(0)
    .limit(200);
  try {
    return users;
  } catch (e) {
    logger.error(`${e}`);
  }
};


module.exports = {
  userQuery,
  usersQuery,
};
